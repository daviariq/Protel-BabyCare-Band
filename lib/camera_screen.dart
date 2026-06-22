import 'package:flutter/material.dart';
import 'package:flutter_mjpeg/flutter_mjpeg.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({super.key});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  // ⚠️ PASTIKAN URL INI MENGARAH KE ORANGE PI KAMU
  final String streamUrl = "http://10.125.26.251:81/stream";
  bool isLive = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text('Live Camera', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Container(
                width: double.infinity,
                color: const Color(0xFF0F172A), 
                child: AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Mjpeg(
                    isLive: isLive,
                    error: (context, error, stack) => Center(
                      child: Text('Kamera Offline/Loading...\n($error)', textAlign: TextAlign.center, style: const TextStyle(color: Colors.redAccent)),
                    ),
                    stream: streamUrl,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}