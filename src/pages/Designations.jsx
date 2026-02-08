import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
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
        .select("id, name, grade, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDesignations(data);
      }

      setLoading(false);
    };

    loadDesignations();
  }, []);

  const resetForm = () => {
    setFormState({ name: "", grade: "" });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (designation) => {
    setFormState({
      name: designation.name ?? "",
      grade: designation.grade ?? ""
    });
    setEditingId(designation.id);
    setError("");
  };

  const handleDelete = async (designationId) => {
    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("designations")
      .delete()
      .eq("id", designationId);

    if (deleteError) {
      setError(`পদবী মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setError("");
    setDesignations((prev) => prev.filter((row) => row.id !== designationId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setError("পদবীর নাম লিখুন।");
      return;
    }

    setError("");

    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingId) {
      const updated = { ...formState, id: editingId };
      const { error: updateError } = await supabase
        .from("designations")
        .update({
          name: updated.name,
          grade: updated.grade || null
        })
        .eq("id", editingId);

      if (updateError) {
        setError(`পদবী আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setDesignations((prev) =>
        prev.map((row) => (row.id === editingId ? { ...row, ...updated } : row))
      );

      resetForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("designations")
      .insert({
        name: formState.name.trim(),
        grade: formState.grade.trim() || null
      })
      .select("id, name, grade, created_at")
      .single();

    if (insertError) {
      setError(`পদবী সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      setDesignations((prev) => [data, ...prev]);
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
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="উদাহরণ: HR Officer"
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
              <th>গ্রেড</th>
              <th>তৈরির তারিখ</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {designations.length === 0 ? (
              <tr>
                <td colSpan={5}>কোন পদবী পাওয়া যায়নি।</td>
              </tr>
            ) : (
              designations.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
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
