import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatProjectDate } from "../utils/date";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: ""
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
        .select("id, name, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDepartments(data);
      }

      setLoading(false);
    };

    loadDepartments();
  }, []);

  const resetForm = () => {
    setFormState({ name: "" });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (dept) => {
    setFormState({
      name: dept.name ?? ""
    });
    setEditingId(dept.id);
    setError("");
  };

  const handleDelete = async (deptId) => {
    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("departments")
      .delete()
      .eq("id", deptId);

    if (deleteError) {
      setError(`বিভাগ মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setError("");
    setDepartments((prev) => prev.filter((dept) => dept.id !== deptId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setError("বিভাগের নাম লিখুন।");
      return;
    }

    setError("");

    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingId) {
      const updated = {
        ...formState,
        id: editingId
      };

      const { error: updateError } = await supabase
        .from("departments")
        .update({
          name: updated.name
        })
        .eq("id", editingId);

      if (updateError) {
        setError(`বিভাগ আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setDepartments((prev) =>
        prev.map((dept) => (dept.id === editingId ? { ...dept, ...updated } : dept))
      );

      resetForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("departments")
      .insert({
        name: formState.name.trim()
      })
      .select("id, name, created_at")
      .single();

    if (insertError) {
      setError(`বিভাগ সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      setDepartments((prev) => [data, ...prev]);
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
              <th>তৈরির তারিখ</th>
              <th>অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5}>কোন বিভাগ পাওয়া যায়নি।</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{formatProjectDate(dept.created_at)}</td>
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
