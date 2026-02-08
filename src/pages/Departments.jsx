import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    code: "",
    manager: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, code, manager, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDepartments(data);
      }

      setLoading(false);
    };

    loadDepartments();
  }, []);

  const resetForm = () => {
    setFormState({ name: "", code: "", manager: "" });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (dept) => {
    setFormState({
      name: dept.name ?? "",
      code: dept.code ?? "",
      manager: dept.manager ?? ""
    });
    setEditingId(dept.id);
    setError("");
  };

  const handleDelete = async (deptId) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== deptId));

    if (!supabase) {
      return;
    }

    await supabase.from("departments").delete().eq("id", deptId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setError("বিভাগের নাম লিখুন।");
      return;
    }

    setError("");

    if (editingId) {
      const updated = {
        ...formState,
        id: editingId
      };

      setDepartments((prev) =>
        prev.map((dept) => (dept.id === editingId ? { ...dept, ...updated } : dept))
      );

      if (supabase) {
        await supabase
          .from("departments")
          .update({
            name: updated.name,
            code: updated.code || null,
            manager: updated.manager || null
          })
          .eq("id", editingId);
      }

      resetForm();
      return;
    }

    const newDepartment = {
      id: Date.now(),
      name: formState.name.trim(),
      code: formState.code.trim(),
      manager: formState.manager.trim(),
      created_at: new Date().toISOString()
    };

    setDepartments((prev) => [newDepartment, ...prev]);

    if (supabase) {
      const { data } = await supabase
        .from("departments")
        .insert({
          name: newDepartment.name,
          code: newDepartment.code || null,
          manager: newDepartment.manager || null
        })
        .select("id, name, code, manager, created_at")
        .single();

      if (data) {
        setDepartments((prev) => [data, ...prev.filter((dept) => dept.id !== newDepartment.id)]);
      }
    }

    resetForm();
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>ডিপার্টমেন্ট</h2>
          <p>বিভাগের তালিকা এবং নতুন বিভাগ যোগ করুন।</p>
        </div>
        <button className="button" type="button" onClick={resetForm}>
          নতুন বিভাগ
        </button>
      </header>

      <section className="section card">
        <h3>{editingId ? "বিভাগ হালনাগাদ করুন" : "নতুন বিভাগ যোগ করুন"}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            বিভাগের নাম
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="উদাহরণ: প্রশাসন"
            />
          </label>
          <label className="field">
            বিভাগের কোড
            <input
              name="code"
              value={formState.code}
              onChange={handleChange}
              placeholder="ADM-001"
            />
          </label>
          <label className="field">
            ম্যানেজার
            <input
              name="manager"
              value={formState.manager}
              onChange={handleChange}
              placeholder="ম্যানেজার নাম"
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
              <th>নাম</th>
              <th>কোড</th>
              <th>ম্যানেজার</th>
              <th>তৈরির তারিখ</th>
              <th>অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={7}>কোন বিভাগ পাওয়া যায়নি।</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.code || "-"}</td>
                  <td>{dept.manager || "-"}</td>
                  <td>{new Date(dept.created_at).toLocaleDateString("bn-BD")}</td>
                  <td>
                    <span className="badge success">সক্রিয়</span>
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleEdit(dept)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleDelete(dept.id)}
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
