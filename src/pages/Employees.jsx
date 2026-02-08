import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    pf_number: "",
    mobile_number: "",
    present_address: "",
    permanent_address: "",
    blood_group: "",
    home_district: "",
    about: "",
    desig_id: "",
    dept_id: "",
    basic_salary: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select(
          "id, name, pf_number, mobile_number, present_address, permanent_address, blood_group, home_district, about, basic_salary, dept_id, desig_id, departments(name), designations(name)"
        )
        .order("id", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row) => ({
          id: row.id,
          name: row.name,
          pf_number: row.pf_number,
          mobile_number: row.mobile_number,
          present_address: row.present_address,
          permanent_address: row.permanent_address,
          blood_group: row.blood_group,
          home_district: row.home_district,
          about: row.about,
          designation: row.designations?.name ?? "-",
          dept: row.departments?.name ?? "-",
          dept_id: row.dept_id ?? "",
          desig_id: row.desig_id ?? "",
          basic_salary: row.basic_salary
        }));
        setEmployees(normalized);
      }

      setLoading(false);
    };

    const loadDepartments = async () => {
      if (!supabase) {
        return;
      }

      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setDepartments(data);
      }
    };

    const loadDesignations = async () => {
      if (!supabase) {
        return;
      }

      const { data, error } = await supabase
        .from("designations")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setDesignations(data);
      }
    };

    loadEmployees();
    loadDepartments();
    loadDesignations();
  }, []);

  const resetForm = () => {
    setFormState({
      name: "",
      pf_number: "",
      mobile_number: "",
      present_address: "",
      permanent_address: "",
      blood_group: "",
      home_district: "",
      about: "",
      desig_id: "",
      dept_id: "",
      basic_salary: ""
    });
    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (emp) => {
    setFormState({
      name: emp.name ?? "",
      pf_number: emp.pf_number ?? "",
      mobile_number: emp.mobile_number ?? "",
      present_address: emp.present_address ?? "",
      permanent_address: emp.permanent_address ?? "",
      blood_group: emp.blood_group ?? "",
      home_district: emp.home_district ?? "",
      about: emp.about ?? "",
      desig_id: emp.desig_id ? String(emp.desig_id) : "",
      dept_id: emp.dept_id ? String(emp.dept_id) : "",
      basic_salary: emp.basic_salary ?? ""
    });
    setEditingId(emp.id);
    setError("");
  };

  const handleView = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleDelete = async (empId) => {
    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", empId);

    if (deleteError) {
      setError(`কর্মী মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setError("");
    setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
    setSelectedEmployee((prev) => (prev?.id === empId ? null : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim() || !formState.pf_number.trim()) {
      setError("নাম এবং PF নম্বর প্রয়োজন।");
      return;
    }

    setError("");
    const departmentIdValue = formState.dept_id
      ? Number(formState.dept_id)
      : null;
    const designationIdValue = formState.desig_id ? Number(formState.desig_id) : null;
    const departmentName =
      departments.find((dept) => dept.id === departmentIdValue)?.name ?? "-";
    const designationName =
      designations.find((desig) => desig.id === designationIdValue)?.name ?? "-";

    if (!supabase) {
      setError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingId) {
      const updated = {
        id: editingId,
        name: formState.name.trim(),
        pf_number: formState.pf_number.trim(),
        mobile_number: formState.mobile_number.trim(),
        present_address: formState.present_address.trim(),
        permanent_address: formState.permanent_address.trim(),
        blood_group: formState.blood_group.trim(),
        home_district: formState.home_district.trim(),
        about: formState.about.trim(),
        designation: designationName,
        dept_id: departmentIdValue,
        desig_id: designationIdValue,
        dept: departmentName,
        basic_salary: Number(formState.basic_salary) || 0
      };

      const { error: updateError } = await supabase
        .from("employees")
        .update({
          name: updated.name,
          pf_number: updated.pf_number,
          mobile_number: updated.mobile_number || null,
          present_address: updated.present_address || null,
          permanent_address: updated.permanent_address || null,
          blood_group: updated.blood_group || null,
          home_district: updated.home_district || null,
          about: updated.about || null,
          dept_id: updated.dept_id,
          desig_id: updated.desig_id,
          basic_salary: updated.basic_salary || 0
        })
        .eq("id", editingId);

      if (updateError) {
        setError(`কর্মী আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingId ? { ...emp, ...updated } : emp))
      );

      resetForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("employees")
      .insert({
        name: formState.name.trim(),
        pf_number: formState.pf_number.trim(),
        mobile_number: formState.mobile_number.trim() || null,
        present_address: formState.present_address.trim() || null,
        permanent_address: formState.permanent_address.trim() || null,
        blood_group: formState.blood_group.trim() || null,
        home_district: formState.home_district.trim() || null,
        about: formState.about.trim() || null,
        basic_salary: Number(formState.basic_salary) || 0,
        dept_id: departmentIdValue,
        desig_id: designationIdValue
      })
      .select(
        "id, name, pf_number, mobile_number, present_address, permanent_address, blood_group, home_district, about, basic_salary, dept_id, desig_id, departments(name), designations(name)"
      )
      .single();

    if (insertError) {
      setError(`কর্মী সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      const normalized = {
        id: data.id,
        name: data.name,
        pf_number: data.pf_number,
        mobile_number: data.mobile_number,
        present_address: data.present_address,
        permanent_address: data.permanent_address,
        blood_group: data.blood_group,
        home_district: data.home_district,
        about: data.about,
        designation: data.designations?.name ?? "-",
        dept: data.departments?.name ?? "-",
        dept_id: data.dept_id ?? "",
        desig_id: data.desig_id ?? "",
        basic_salary: data.basic_salary
      };
      setEmployees((prev) => [normalized, ...prev]);
    }

    resetForm();
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>কর্মী তালিকা</h2>
          <p>কর্মীদের তথ্য সংরক্ষণ ও হালনাগাদ করুন।</p>
        </div>
        <button className="button" type="button" onClick={resetForm}>
          নতুন কর্মী
        </button>
      </header>

      <section className="section card">
        <h3>{editingId ? "কর্মী হালনাগাদ করুন" : "দ্রুত যোগ করুন"}</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            নাম
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="কর্মীর নাম"
            />
          </label>
          <label className="field">
            PF নম্বর
            <input
              name="pf_number"
              value={formState.pf_number}
              onChange={handleChange}
              placeholder="PF-1005"
            />
          </label>
          <label className="field">
            মোবাইল
            <input
              name="mobile_number"
              value={formState.mobile_number}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
            />
          </label>
          <label className="field">
            রক্তের গ্রুপ
            <input
              name="blood_group"
              value={formState.blood_group}
              onChange={handleChange}
              placeholder="A+"
            />
          </label>
          <label className="field">
            বিভাগ
            <select name="dept_id" value={formState.dept_id} onChange={handleChange}>
              <option value="">বিভাগ নির্বাচন করুন</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            পদবী
            <select name="desig_id" value={formState.desig_id} onChange={handleChange}>
              <option value="">পদবী নির্বাচন করুন</option>
              {designations.map((desig) => (
                <option key={desig.id} value={desig.id}>
                  {desig.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            হোম ডিস্ট্রিক্ট
            <input
              name="home_district"
              value={formState.home_district}
              onChange={handleChange}
              placeholder="হোম ডিস্ট্রিক্ট"
            />
          </label>
          <label className="field">
            বেসিক বেতন
            <input
              name="basic_salary"
              type="number"
              value={formState.basic_salary}
              onChange={handleChange}
              placeholder="35000"
            />
          </label>
          <label className="field field-full">
            About
            <textarea
              name="about"
              value={formState.about}
              onChange={handleChange}
              placeholder="কর্মীর সংক্ষিপ্ত তথ্য"
              rows={3}
            />
          </label>
          <label className="field">
            বর্তমান ঠিকানা
            <textarea
              name="present_address"
              value={formState.present_address}
              onChange={handleChange}
              placeholder="বর্তমান ঠিকানা"
              rows={2}
            />
          </label>
          <label className="field">
            স্থায়ী ঠিকানা
            <textarea
              name="permanent_address"
              value={formState.permanent_address}
              onChange={handleChange}
              placeholder="স্থায়ী ঠিকানা"
              rows={2}
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

      {selectedEmployee && (
        <section className="section card">
          <header className="page-header">
            <div>
              <h3>কর্মী তথ্য</h3>
              <p>{selectedEmployee.name}</p>
            </div>
            <button
              className="button secondary"
              type="button"
              onClick={() => setSelectedEmployee(null)}
            >
              বন্ধ করুন
            </button>
          </header>
          <div className="info-grid">
            <div>
              <strong>PF নম্বর:</strong> {selectedEmployee.pf_number || "-"}
            </div>
            <div>
              <strong>বিভাগ:</strong> {selectedEmployee.dept || "-"}
            </div>
            <div>
              <strong>পদবী:</strong> {selectedEmployee.designation || "-"}
            </div>
            <div>
              <strong>ব্লাড গ্রুপ:</strong> {selectedEmployee.blood_group || "-"}
            </div>
            <div>
              <strong>মোবাইল:</strong> {selectedEmployee.mobile_number || "-"}
            </div>
            <div>
              <strong>বেসিক বেতন:</strong>{" "}
              {Number(selectedEmployee.basic_salary || 0).toLocaleString("bn-BD")}
            </div>
            <div>
              <strong>হোম ডিস্ট্রিক্ট:</strong> {selectedEmployee.home_district || "-"}
            </div>
            <div>
              <strong>বর্তমান ঠিকানা:</strong> {selectedEmployee.present_address || "-"}
            </div>
            <div>
              <strong>স্থায়ী ঠিকানা:</strong> {selectedEmployee.permanent_address || "-"}
            </div>
            <div>
              <strong>About:</strong> {selectedEmployee.about || "-"}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>নাম</th>
              <th>PF</th>
              <th>বিভাগ</th>
              <th>পদবী</th>
              <th>ব্লাড গ্রুপ</th>
              <th>মোবাইল</th>
              <th>ভিউ</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8}>কোন কর্মী পাওয়া যায়নি।</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.pf_number}</td>
                  <td>{emp.dept}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.blood_group || "-"}</td>
                  <td>{emp.mobile_number || "-"}</td>
                  <td>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => handleView(emp)}
                    >
                      ভিউ
                    </button>
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleEdit(emp)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleDelete(emp.id)}
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
