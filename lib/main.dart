import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'home_screen.dart';
import 'camera_screen.dart';
import 'history_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // MENGHIDUPKAN KEMBALI KONEKSI CLOUD SUPABASE
  await Supabase.initialize(
    url: 'https://mglbcucrsqxokfxouuyy.supabase.co',
    anonKey: 'sb_publishable_8hCWms9CiYxAA9A6PT7P-g__rfXbNF9',
  );
  
  runApp(const BabyCareApp());
}

class BabyCareApp extends StatelessWidget {
  const BabyCareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BabyCare Hybrid',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          background: const Color(0xFFF8FAFC),
        ),
        useMaterial3: true,
      ),
      home: const MainLayout(),
    );
  }
}

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const CameraScreen(),
    const HistoryScreen(), 
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // KUNCI PERBAIKAN: Menggunakan IndexedStack agar state halaman tidak dihancurkan
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: Colors.grey.shade300, width: 1)),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          backgroundColor: Colors.white,
          indicatorColor: Theme.of(context).colorScheme.primaryContainer,
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Kontrol'),
            NavigationDestination(icon: Icon(Icons.videocam_outlined), selectedIcon: Icon(Icons.videocam), label: 'Kamera'),
            NavigationDestination(icon: Icon(Icons.history_outlined), selectedIcon: Icon(Icons.history), label: 'Riwayat'),
          ],
        ),
      ),
    );
  }
}