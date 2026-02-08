import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    department: "",
    grade: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDesignations = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("designations")
        .select("id, title, department, grade, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDesignations(data);
      }

      setLoading(false);
    };

    loadDesignations();
  }, []);

  const resetForm = () => {
    setFormState({ title: "", department: "", grade: "" });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (designation) => {
    setFormState({
      title: designation.title ?? "",
      department: designation.department ?? "",
      grade: designation.grade ?? ""
    });
    setEditingId(designation.id);
    setError("");
  };

  const handleDelete = async (designationId) => {
    setDesignations((prev) => prev.filter((row) => row.id !== designationId));

    if (!supabase) {
      return;
    }

    await supabase.from("designations").delete().eq("id", designationId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.title.trim()) {
      setError("পদবীর নাম লিখুন।");
      return;
    }

    setError("");

    if (editingId) {
      const updated = { ...formState, id: editingId };
      setDesignations((prev) =>
        prev.map((row) => (row.id === editingId ? { ...row, ...updated } : row))
      );

      if (supabase) {
        await supabase
          .from("designations")
          .update({
            title: updated.title,
            department: updated.department || null,
            grade: updated.grade || null
          })
          .eq("id", editingId);
      }

      resetForm();
      return;
    }

    const newDesignation = {
      id: Date.now(),
      title: formState.title.trim(),
      department: formState.department.trim(),
      grade: formState.grade.trim(),
      created_at: new Date().toISOString()
    };

    setDesignations((prev) => [newDesignation, ...prev]);

    if (supabase) {
      const { data } = await supabase
        .from("designations")
        .insert({
          title: newDesignation.title,
          department: newDesignation.department || null,
          grade: newDesignation.grade || null
        })
        .select("id, title, department, grade, created_at")
        .single();

      if (data) {
        setDesignations((prev) => [data, ...prev.filter((row) => row.id !== newDesignation.id)]);
      }
    }

    resetForm();
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>পদবী</h2>
          <p>পদবীর তালিকা এবং নতুন পদবী যোগ করুন।</p>
        </div>
        <button className="button" type="button" onClick={resetForm}>
          নতুন পদবী
        </button>
      </header>

      <section className="section card">
        <h3>{editingId ? "পদবী হালনাগাদ করুন" : "নতুন পদবী যোগ করুন"}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            পদবীর নাম
            <input
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="উদাহরণ: HR Officer"
            />
          </label>
          <label className="field">
            বিভাগ
            <input
              name="department"
              value={formState.department}
              onChange={handleChange}
              placeholder="উদাহরণ: মানব সম্পদ"
            />
          </label>
          <label className="field">
            গ্রেড
            <input
              name="grade"
              value={formState.grade}
              onChange={handleChange}
              placeholder="G-5"
            />
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
              <th>ID</th>
              <th>পদবী</th>
              <th>বিভাগ</th>
              <th>গ্রেড</th>
              <th>তৈরির তারিখ</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {designations.length === 0 ? (
              <tr>
                <td colSpan={6}>কোন পদবী পাওয়া যায়নি।</td>
              </tr>
            ) : (
              designations.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.title}</td>
                  <td>{row.department || "-"}</td>
                  <td>{row.grade || "-"}</td>
                  <td>{new Date(row.created_at).toLocaleDateString("bn-BD")}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleEdit(row)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleDelete(row.id)}
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
