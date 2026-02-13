# NU HRM (React + Supabase)

বাংলায় HRM ড্যাশবোর্ড, ডিপার্টমেন্ট, কর্মী, হাজিরা এবং ছুটি ব্যবস্থাপনা মডিউলসহ একটি স্টার্টার প্রজেক্ট।

## Feature highlights
- Department, employee, attendance management
- Leave management dashboard (bonus feature)
- Payroll run tracking (schema only)
- Supabase-ready schema and optional live data fetch

## Setup
1. `.env` ফাইলে Supabase কনফিগার করুন (একটি উদাহরণ নিচে)।
2. `supabase/schema.sql` ফাইলটি Supabase SQL editor এ রান করুন।
3. ডেভ সার্ভার চালান।

```bash
npm install
npm run dev
```

## Environment variables
`.env` ফাইলে যোগ করুন:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Pages
- Dashboard
- Departments
- Employees
- Attendance
- Leaves

## Flutter অ্যাপে employees ডাটা ব্যবহার করার উপায়

আপনি Flutter অ্যাপ থেকে Supabase `employees` টেবিলের ডাটা দুইভাবে নিতে পারেন:

1. **REST API (http package) দিয়ে**
2. **`supabase_flutter` package দিয়ে (recommended)**

---

### Option A: REST API দিয়ে (Flutter `http`)

#### 1) `pubspec.yaml` এ dependency যোগ করুন

```yaml
dependencies:
  http: ^1.2.2
```

#### 2) API call করার Dart code

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class EmployeeApi {
  final String supabaseUrl = 'https://<YOUR_PROJECT_REF>.supabase.co';
  final String anonKey = '<YOUR_SUPABASE_ANON_KEY>';

  Future<List<dynamic>> getEmployees() async {
    final uri = Uri.parse('$supabaseUrl/rest/v1/employees?select=*');

    final response = await http.get(
      uri,
      headers: {
        'apikey': anonKey,
        'Authorization': 'Bearer $anonKey',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }

    throw Exception('Failed to load employees: ${response.body}');
  }
}
```

---

### Option B: `supabase_flutter` দিয়ে (Recommended)

#### 1) dependency যোগ করুন

```yaml
dependencies:
  supabase_flutter: ^2.6.0
```

#### 2) app initialize করুন

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

await Supabase.initialize(
  url: 'https://<YOUR_PROJECT_REF>.supabase.co',
  anonKey: '<YOUR_SUPABASE_ANON_KEY>',
);
```

#### 3) employees fetch করুন

```dart
final supabase = Supabase.instance.client;

final data = await supabase
    .from('employees')
    .select('*')
    .order('id', ascending: false);

print(data);
```

---

### Flutter UI তে simple usage

```dart
FutureBuilder<List<dynamic>>(
  future: EmployeeApi().getEmployees(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) {
      return const CircularProgressIndicator();
    }

    final employees = snapshot.data!;
    return ListView.builder(
      itemCount: employees.length,
      itemBuilder: (context, index) {
        final emp = employees[index] as Map<String, dynamic>;
        return ListTile(
          title: Text(emp['name']?.toString() ?? '-'),
          subtitle: Text(emp['pf_number']?.toString() ?? '-'),
        );
      },
    );
  },
)
```

### গুরুত্বপূর্ণ (না হলে ডাটা আসবে না)

- Supabase এ `employees` টেবিলের জন্য `SELECT` policy (RLS policy) allow করতে হবে।
- `anon key` কখনো Flutter source code এ hardcode না করে `--dart-define` বা secure config দিয়ে দিন।
- CORS নিয়ে Flutter mobile app এ সাধারণত সমস্যা হয় না, তবে Flutter Web এ হতে পারে।
