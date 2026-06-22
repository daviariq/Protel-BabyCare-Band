import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: const Text('Riwayat Tangisan', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.indigo.shade900,
      ),
      body: StreamBuilder(
        stream: Supabase.instance.client
            .from('cry_history')
            .stream(primaryKey: ['id'])
            .order('created_at', ascending: false),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: Colors.indigo));
          }
          
          final data = snapshot.data as List<dynamic>;
          
          if (data.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history_toggle_off, size: 80, color: Colors.grey.shade300),
                  const SizedBox(height: 16),
                  Text("Belum ada riwayat tangisan.", style: TextStyle(color: Colors.grey.shade500, fontSize: 16)),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            itemCount: data.length,
            itemBuilder: (context, index) {
              final item = data[index];
              final status = item['status'] ?? 'Unknown';
              
              // 👇 Variabel confidence/persentase sudah dihapus
              
              String timeRaw = item['created_at'].toString();
              DateTime parsedTime = DateTime.parse(timeRaw).toLocal();
              
              String time = "${parsedTime.year}-${parsedTime.month.toString().padLeft(2, '0')}-${parsedTime.day.toString().padLeft(2, '0')} "
                            "${parsedTime.hour.toString().padLeft(2, '0')}:${parsedTime.minute.toString().padLeft(2, '0')}";

              Color iconColor = status.toLowerCase() == 'hungry' ? Colors.orange : Colors.red;
              IconData iconData = status.toLowerCase() == 'hungry' ? Icons.restaurant_menu : Icons.sick_outlined;

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.grey.shade100, blurRadius: 8, offset: const Offset(0, 4))],
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(color: iconColor.withOpacity(0.1), shape: BoxShape.circle),
                    child: Icon(iconData, color: iconColor),
                  ),
                  title: Text(status, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Text(time, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                  ),
                  // 👇 Trailing (persentase) ditiadakan agar lebih bersih
                ),
              );
            },
          );
        },
      ),
    );
  }
}