import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:io';
import 'dart:async';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  StreamSubscription? _crySubscription;
  DateTime? _lastAlertTime;
  DateTime? _lastStoppedTime; 
  bool _isDialogOpen = false; 

  @override
  void initState() {
    super.initState();
    _setupRealtimeListener();
  }

  @override
  void dispose() {
    _crySubscription?.cancel();
    super.dispose();
  }

  // ==========================================
  // 1. PENDENGAR CLOUD (UNTUK POP-UP NOTIF)
  // ==========================================
  void _setupRealtimeListener() {
    _crySubscription = Supabase.instance.client
        .from('cry_history')
        .stream(primaryKey: ['id'])
        .order('created_at', ascending: false)
        .limit(1)
        .listen((List<Map<String, dynamic>> data) {
      if (data.isEmpty) return;

      final latestCry = data.first;
      final cryTime = DateTime.parse(latestCry['created_at'].toString()).toLocal();
      final status = latestCry['status'].toString().toUpperCase();

      if (DateTime.now().difference(cryTime).inMinutes < 1) {
        if (_lastAlertTime == null || cryTime.isAfter(_lastAlertTime!)) {
          _lastAlertTime = cryTime;
          _showEmergencyAlert(status);
        }
      }
    });
  }

  void _showEmergencyAlert(String status) {
    if (!mounted) return;
    
    if (_isDialogOpen) {
      Navigator.of(context).pop();
      _isDialogOpen = false;
    }

    Color cryColor = status == 'HUNGRY' ? Colors.orange.shade700 : Colors.red.shade700;
    _isDialogOpen = true; 

    showDialog(
      context: context,
      barrierDismissible: false, 
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.warning_amber_rounded, color: Colors.red.shade800, size: 40),
              ),
              const SizedBox(height: 16),
              Text(
                'TANGISAN TERDETEKSI!',
                style: TextStyle(
                  color: Colors.red.shade900,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Sistem AI mendeteksi bayi Anda menangis dengan kategori:',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.blueGrey, fontSize: 14),
              ),
              const SizedBox(height: 16),
              
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color: cryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: cryColor.withOpacity(0.3), width: 1.5),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: cryColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 24,
                    letterSpacing: 2,
                  ),
                ),
              ),
              const SizedBox(height: 18),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.vibration, color: Colors.orange.shade600, size: 18),
                  const SizedBox(width: 6),
                  const Text(
                    'Gelang notifikasi sedang aktif bergetar!',
                    style: TextStyle(color: Colors.black87, fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ],
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
                  _sendUDPCommand("STOP"); 
                },
                icon: const Icon(Icons.front_hand, size: 20),
                label: const Text(
                  'HENTIKAN GETARAN & RESPONS',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade600,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                ),
              ),
            ),
          ],
        );
      },
    ).then((_) {
      _isDialogOpen = false; 
    });
  }

  // ==========================================
  // 2. KONTROL HARDWARE (UDP LOKAL INSTAN)
  // ==========================================
  Future<void> _sendUDPCommand(String command) async {
    if (command == "STOP") {
      setState(() {
        _lastStoppedTime = DateTime.now();
      });
    }

    try {
      final espAddress = InternetAddress('10.125.26.227');
      const espPort = 5000;

      final socket = await RawDatagramSocket.bind(InternetAddress.anyIPv4, 0);
      socket.send(command.codeUnits, espAddress, espPort);
      socket.close();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sinyal "$command" berhasil ditembakkan!'), backgroundColor: Colors.green, behavior: SnackBarBehavior.floating),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal mengirim sinyal: $e'), backgroundColor: Colors.red, behavior: SnackBarBehavior.floating),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: const Text('Hybrid Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.indigo.shade900,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- KARTU STATUS UTAMA ---
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [Colors.indigo.shade400, Colors.indigo.shade700], begin: Alignment.topLeft, end: Alignment.bottomRight),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: Colors.indigo.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
              ),
              child: Column(
                children: [
                  const Icon(Icons.child_care, size: 64, color: Colors.white),
                  const SizedBox(height: 16),
                  const Text("Status Saat Ini", style: TextStyle(color: Colors.white70, fontSize: 16)),
                  const SizedBox(height: 8),
                  StreamBuilder(
                    stream: Supabase.instance.client.from('cry_history').stream(primaryKey: ['id']).order('created_at', ascending: false).limit(1),
                    builder: (context, snapshot) {
                      // 👇 TEKS DIPERSINGKAT MENJADI STANDBY
                      String currentStatus = "STANDBY";
                      
                      if (snapshot.hasData) {
                        final data = snapshot.data as List<dynamic>;
                        if (data.isNotEmpty) {
                          DateTime eventTime = DateTime.parse(data[0]['created_at'].toString()).toLocal();
                          
                          bool isNewCry = _lastStoppedTime == null || eventTime.isAfter(_lastStoppedTime!);

                          if (isNewCry && DateTime.now().difference(eventTime).inMinutes < 2) {
                            currentStatus = data[0]['status'].toString().toUpperCase();
                          }
                        }
                      }
                      return Text(currentStatus, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 2));
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            
            Text("Kontrol Perangkat (Direct WiFi)", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueGrey.shade800)),
            const SizedBox(height: 16),

            SizedBox(
              height: 60,
              child: ElevatedButton.icon(
                onPressed: () => _sendUDPCommand("POLA_1"),
                icon: const Icon(Icons.vibration, size: 28),
                // 👇 TEKS TOMBOL DIPERSINGKAT
                label: const Text('TEST GETAR', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.orange.shade500, foregroundColor: Colors.white, elevation: 4, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              height: 60,
              child: ElevatedButton.icon(
                onPressed: () => _sendUDPCommand("STOP"),
                icon: const Icon(Icons.stop_circle_outlined, size: 28),
                label: const Text('HENTIKAN GETARAN', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1)),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade600, foregroundColor: Colors.white, elevation: 4, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              ),
            ),
          ],
        ),
      ),
    );
  }
}