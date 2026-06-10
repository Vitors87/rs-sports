import 'package:flutter/material.dart';
import '../models/sport.dart';
import '../services/activity_service.dart';
import '../services/sport_service.dart';
import '../theme/app_theme.dart';

class NewActivityScreen extends StatefulWidget {
  const NewActivityScreen({super.key});

  @override
  State<NewActivityScreen> createState() => _NewActivityScreenState();
}

class _NewActivityScreenState extends State<NewActivityScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _distanceCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _elevationCtrl = TextEditingController();

  final _activityService = ActivityService();
  final _sportService = SportService();

  List<Sport> _sports = [];
  Sport? _selectedSport;
  DateTime _date = DateTime.now();
  bool _loading = false;
  bool _loadingSports = true;

  @override
  void initState() {
    super.initState();
    _loadSports();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _distanceCtrl.dispose();
    _durationCtrl.dispose();
    _elevationCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadSports() async {
    try {
      final sports = await _sportService.fetchSports();
      if (mounted) {
        setState(() {
          _sports = sports;
          _selectedSport = sports.isNotEmpty ? sports.first : null;
          _loadingSports = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loadingSports = false);
    }
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _date = picked);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _selectedSport == null) return;
    setState(() => _loading = true);
    try {
      await _activityService.createActivity(
        sportId: _selectedSport!.id,
        title: _titleCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        distance: double.tryParse(_distanceCtrl.text),
        duration: int.tryParse(_durationCtrl.text),
        elevation: double.tryParse(_elevationCtrl.text),
        date: _date.toIso8601String(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('¡Actividad registrada!'), backgroundColor: AppTheme.primary),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nueva Actividad')),
      body: _loadingSports
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const _SectionLabel(label:'Deporte'),
                  DropdownButtonFormField<Sport>(
                    initialValue: _selectedSport,
                    items: _sports.map((s) {
                      final emoji = AppTheme.sportEmoji(s.type);
                      return DropdownMenuItem(value: s, child: Text('$emoji ${AppTheme.sportLabel(s.type)}'));
                    }).toList(),
                    onChanged: (v) => setState(() => _selectedSport = v),
                    decoration: const InputDecoration(border: OutlineInputBorder()),
                    validator: (v) => v == null ? 'Selecciona un deporte' : null,
                  ),
                  const SizedBox(height: 16),
                  const _SectionLabel(label:'Título *'),
                  TextFormField(
                    controller: _titleCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Ej: Carrera matutina por el parque',
                      border: OutlineInputBorder(),
                    ),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'El título es requerido' : null,
                  ),
                  const SizedBox(height: 16),
                  const _SectionLabel(label:'Descripción'),
                  TextFormField(
                    controller: _descCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Describe tu actividad...',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const _SectionLabel(label:'Distancia (km)'),
                            TextFormField(
                              controller: _distanceCtrl,
                              decoration: const InputDecoration(
                                hintText: '0.0',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const _SectionLabel(label:'Duración (min)'),
                            TextFormField(
                              controller: _durationCtrl,
                              decoration: const InputDecoration(
                                hintText: '0',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const _SectionLabel(label:'Elevación (m)'),
                  TextFormField(
                    controller: _elevationCtrl,
                    decoration: const InputDecoration(
                      hintText: '0',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),
                  const _SectionLabel(label:'Fecha'),
                  InkWell(
                    onTap: _pickDate,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFD1D5DB)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 18, color: AppTheme.textSecondary),
                          const SizedBox(width: 8),
                          Text(
                            '${_date.day}/${_date.month}/${_date.year}',
                            style: const TextStyle(fontSize: 15),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _loading ? null : _submit,
                    child: _loading
                        ? const SizedBox(
                            width: 20, height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : const Text('Registrar Actividad'),
                  ),
                ],
              ),
            ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        label,
        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
      ),
    );
  }
}
