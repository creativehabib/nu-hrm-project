import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const statusOptions = [
  { value: "Present", label: "উপস্থিত" },
  { value: "Absent", label: "অনুপস্থিত" }
];

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    employee_id: "",
    date: "",
    status: "Present"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      if (!supabase) {
        return;
      }

      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("id, name")
        .order("name");

      if (!employeeError && employeeData) {
        setEmployees(employeeData);
      }

      const employeeMap = new Map(
        (employeeData ?? []).map((employee) => [employee.id, employee.name])
      );

      setLoading(true);
      const { data, error } = await supabase
        .from("attendance")
        .select("id, date, status, employee_id")
        .order("date", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row) => ({
          id: row.id,
          employee_id: row.employee_id ?? "",
          employee_name: employeeMap.get(row.employee_id) ?? "-",
          date: row.date,
          status: row.status
        }));
        setRecords(normalized);
      }

      setLoading(false);
    };

    loadAttendance();
  }, []);

  const resetForm = () => {
    setFormState({ employee_id: "", date: "", status: "Present" });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (record) => {
    setFormState({
      employee_id: record.employee_id ? String(record.employee_id) : "",
      date: record.date,
      status: record.status
    });
    setEditingId(record.id);
    setError("");
  };

  const handleDelete = async (recordId) => {
    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("attendance")
      .delete()
      .eq("id", recordId);

    if (deleteError) {
      setError(`হাজিরা মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setError("");
    setRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.employee_id || !formState.date) {
      setError("কর্মী এবং তারিখ নির্বাচন করুন।");
      return;
    }

    setError("");
    const employeeIdValue = Number(formState.employee_id);
    const employeeName =
      employees.find((emp) => emp.id === employeeIdValue)?.name ?? "-";

    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingId) {
      const updated = {
        id: editingId,
        employee_id: employeeIdValue,
        employee_name: employeeName,
        date: formState.date,
        status: formState.status
      };

      const { error: updateError } = await supabase
        .from("attendance")
        .update({
          employee_id: updated.employee_id,
          date: updated.date,
          status: updated.status
        })
        .eq("id", editingId);

      if (updateError) {
        setError(`হাজিরা আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setRecords((prev) =>
        prev.map((record) => (record.id === editingId ? { ...record, ...updated } : record))
      );

      resetForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("attendance")
      .insert({
        employee_id: employeeIdValue,
        date: formState.date,
        status: formState.status
      })
      .select("id, date, status, employee_id")
      .single();

    if (insertError) {
      setError(`হাজিরা সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      const normalized = {
        id: data.id,
        employee_id: data.employee_id ?? "",
        employee_name: employeeName,
        date: data.date,
        status: data.status
      };
      setRecords((prev) => [normalized, ...prev]);
    }

    resetForm();
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>হাজিরা ট্র্যাকিং</h2>
          <p>দৈনিক উপস্থিতি রেকর্ড পর্যবেক্ষণ করুন।</p>
        </div>
        <button className="button" type="button" onClick={resetForm}>
          নতুন হাজিরা
        </button>
      </header>

      <section className="section card">
        <h3>{editingId ? "হাজিরা হালনাগাদ করুন" : "দ্রুত রেকর্ড"}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            কর্মী
            <select name="employee_id" value={formState.employee_id} onChange={handleChange}>
              <option value="">কর্মী নির্বাচন করুন</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            তারিখ
            <input name="date" type="date" value={formState.date} onChange={handleChange} />
          </label>
          <label className="field">
            অবস্থা
            <select name="status" value={formState.status} onChange={handleChange}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>অ্যাকশন</span>
            <div className="inline-actions">
              <button className="button" type="submit">
                {editingId ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              {editingId && (
                <button className="button secondary" type="button" onClick={resetForm}>
                  বাতিল
                </button>
              )}
            </div>
          </div>
        </form>
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>কর্মী</th>
              <th>তারিখ</th>
              <th>অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4}>কোন হাজিরা পাওয়া যায়নি।</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee_name}</td>
                  <td>{new Date(record.date).toLocaleDateString("bn-BD")}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === "Present" ? "success" : "warning"
                      }`}
                    >
                      {record.status === "Present" ? "উপস্থিত" : "অনুপস্থিত"}
                    </span>
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleEdit(record)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleDelete(record.id)}
                      >
                        মুছুন
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loading && <p>লোড হচ্ছে...</p>}
      </section>
    </div>
  );
}
