import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { supabase } from "../supabaseClient";
import EmployeeInfoA4 from "../components/EmployeeInfoA4";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    pf_number: "",
    mobile_number: "",
    employee_email: "",
    dob: "",
    nid: "",
    gender: "",
    employee_type: "",
    employee_status: "",
    present_address: "",
    permanent_address: "",
    blood_group: "",
    home_district: "",
    bank_name: "",
    ac_no: "",
    joining_date: "",
    prl_date: "",
    about: "",
    desig_id: "",
    dept_id: "",
    basic_salary: ""
  });
  const [error, setError] = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select(
          "id, name, pf_number, mobile_number, email, dob, nid, gender, employee_type, employee_status, present_address, permanent_address, blood_group, home_district, bank_name, ac_no, joining_date, prl_date, about, basic_salary, dept_id, desig_id, departments(name), designations(name)"
        )
        .order("id", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row) => ({
          id: row.id,
          name: row.name,
          pf_number: row.pf_number,
          mobile_number: row.mobile_number,
          employee_email: row.email,
          dob: row.dob,
          nid: row.nid,
          gender: row.gender,
          employee_type: row.employee_type,
          employee_status: row.employee_status,
          present_address: row.present_address,
          permanent_address: row.permanent_address,
          blood_group: row.blood_group,
          home_district: row.home_district,
          bank_name: row.bank_name,
          ac_no: row.ac_no,
          joining_date: row.joining_date,
          prl_date: row.prl_date,
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
      employee_email: "",
      dob: "",
      nid: "",
      gender: "",
      employee_type: "",
      employee_status: "",
      present_address: "",
      permanent_address: "",
      blood_group: "",
      home_district: "",
      bank_name: "",
      ac_no: "",
      joining_date: "",
      prl_date: "",
      about: "",
      desig_id: "",
      dept_id: "",
      basic_salary: ""
    });
    setEditingId(null);
    setError("");
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const closeView = () => {
    setIsViewOpen(false);
    setViewEmployee(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (emp) => {
    setFormState({
      name: emp.name ?? "",
      pf_number: emp.pf_number ?? "",
      mobile_number: emp.mobile_number ?? "",
      employee_email: emp.employee_email ?? "",
      dob: emp.dob ?? "",
      nid: emp.nid ?? "",
      gender: emp.gender ?? "",
      employee_type: emp.employee_type ?? "",
      employee_status: emp.employee_status ?? "",
      present_address: emp.present_address ?? "",
      permanent_address: emp.permanent_address ?? "",
      blood_group: emp.blood_group ?? "",
      home_district: emp.home_district ?? "",
      bank_name: emp.bank_name ?? "",
      ac_no: emp.ac_no ?? "",
      joining_date: emp.joining_date ?? "",
      prl_date: emp.prl_date ?? "",
      about: emp.about ?? "",
      desig_id: emp.desig_id ? String(emp.desig_id) : "",
      dept_id: emp.dept_id ? String(emp.dept_id) : "",
      basic_salary: emp.basic_salary ?? ""
    });
    setEditingId(emp.id);
    setError("");
    setIsFormOpen(true);
  };

  const handleView = (emp) => {
    setViewEmployee(emp);
    setIsViewOpen(true);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: viewEmployee?.pf_number
      ? `employee-${viewEmployee.pf_number}`
      : "employee-info"
  });

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
        employee_email: formState.employee_email.trim(),
        dob: formState.dob || null,
        nid: formState.nid.trim(),
        gender: formState.gender.trim(),
        employee_type: formState.employee_type.trim(),
        employee_status: formState.employee_status.trim(),
        present_address: formState.present_address.trim(),
        permanent_address: formState.permanent_address.trim(),
        blood_group: formState.blood_group.trim(),
        home_district: formState.home_district.trim(),
        bank_name: formState.bank_name.trim(),
        ac_no: formState.ac_no.trim(),
        joining_date: formState.joining_date || null,
        prl_date: formState.prl_date || null,
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
          email: updated.employee_email || null,
          dob: updated.dob || null,
          nid: updated.nid || null,
          gender: updated.gender || null,
          employee_type: updated.employee_type || null,
          employee_status: updated.employee_status || null,
          present_address: updated.present_address || null,
          permanent_address: updated.permanent_address || null,
          blood_group: updated.blood_group || null,
          home_district: updated.home_district || null,
          bank_name: updated.bank_name || null,
          ac_no: updated.ac_no || null,
          joining_date: updated.joining_date || null,
          prl_date: updated.prl_date || null,
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

      closeForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("employees")
      .insert({
        name: formState.name.trim(),
        pf_number: formState.pf_number.trim(),
        mobile_number: formState.mobile_number.trim() || null,
        email: formState.employee_email.trim() || null,
        dob: formState.dob || null,
        nid: formState.nid.trim() || null,
        gender: formState.gender.trim() || null,
        employee_type: formState.employee_type.trim() || null,
        employee_status: formState.employee_status.trim() || null,
        present_address: formState.present_address.trim() || null,
        permanent_address: formState.permanent_address.trim() || null,
        blood_group: formState.blood_group.trim() || null,
        home_district: formState.home_district.trim() || null,
        bank_name: formState.bank_name.trim() || null,
        ac_no: formState.ac_no.trim() || null,
        joining_date: formState.joining_date || null,
        prl_date: formState.prl_date || null,
        about: formState.about.trim() || null,
        basic_salary: Number(formState.basic_salary) || 0,
        dept_id: departmentIdValue,
        desig_id: designationIdValue
      })
      .select(
        "id, name, pf_number, mobile_number, email, dob, nid, gender, employee_type, employee_status, present_address, permanent_address, blood_group, home_district, bank_name, ac_no, joining_date, prl_date, about, basic_salary, dept_id, desig_id, departments(name), designations(name)"
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
        employee_email: data.email,
        dob: data.dob,
        nid: data.nid,
        gender: data.gender,
        employee_type: data.employee_type,
        employee_status: data.employee_status,
        present_address: data.present_address,
        permanent_address: data.permanent_address,
        blood_group: data.blood_group,
        home_district: data.home_district,
        bank_name: data.bank_name,
        ac_no: data.ac_no,
        joining_date: data.joining_date,
        prl_date: data.prl_date,
        about: data.about,
        designation: data.designations?.name ?? "-",
        dept: data.departments?.name ?? "-",
        dept_id: data.dept_id ?? "",
        desig_id: data.desig_id ?? "",
        basic_salary: data.basic_salary
      };
      setEmployees((prev) => [normalized, ...prev]);
    }

    closeForm();
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredEmployees = employees.filter((emp) => {
    if (!normalizedSearch) {
      return true;
    }

    const fields = [
      emp.name,
      emp.pf_number,
      emp.mobile_number,
      emp.employee_email,
      emp.dept,
      emp.designation,
      emp.blood_group,
      emp.home_district,
      emp.nid
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return fields.includes(normalizedSearch);
  });

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>কর্মী তালিকা</h2>
          <p>কর্মীদের তথ্য সংরক্ষণ ও হালনাগাদ করুন।</p>
        </div>
        <button
          className="button"
          type="button"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          নতুন কর্মী
        </button>
      </header>

      {isViewOpen && viewEmployee && (
        <div className="modal-overlay" role="presentation">
          <div className="modal card" role="dialog" aria-modal="true">
            <header className="modal-header print-hidden">
              <div>
                <h3>কর্মীর বিস্তারিত</h3>
                <p>A4 পেইজে দেখুন, প্রিন্ট বা পিডিএফ হিসেবে সংরক্ষণ করুন।</p>
              </div>
              <div className="inline-actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={handlePrint}
                >
                  প্রিন্ট / পিডিএফ
                </button>
                <button className="button secondary" type="button" onClick={closeView}>
                  বন্ধ করুন
                </button>
              </div>
            </header>
            <section ref={printRef}>
              <EmployeeInfoA4
                company={{
                  name: "Nu HRM Project",
                  address: "House 00, Road 00, Dhaka-1200",
                  phone: "+8801XXXXXXXXX",
                  email: "hr@company.com",
                  logoUrl: ""
                }}
                employee={{
                  id: viewEmployee.pf_number || viewEmployee.id,
                  name: viewEmployee.name,
                  department: viewEmployee.dept,
                  designation: viewEmployee.designation,
                  joiningDate: viewEmployee.joining_date || "-",
                  employmentType: viewEmployee.employee_type || "-",
                  status: viewEmployee.employee_status || "Active",
                  phone: viewEmployee.mobile_number,
                  email: viewEmployee.employee_email || "-",
                  dob: viewEmployee.dob || "-",
                  nid: viewEmployee.nid || "-",
                  gender: viewEmployee.gender || "-",
                  bloodGroup: viewEmployee.blood_group,
                  presentAddress: viewEmployee.present_address,
                  permanentAddress: viewEmployee.permanent_address,
                  bankName: viewEmployee.bank_name || "-",
                  bankAccount: viewEmployee.ac_no || "-",
                  bankBranch: "-"
                }}
              />
            </section>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-overlay" role="presentation">
          <div className="modal card" role="dialog" aria-modal="true">
            <header className="modal-header">
              <div>
                <h3>{editingId ? "কর্মী হালনাগাদ করুন" : "নতুন কর্মী যোগ করুন"}</h3>
                <p>কর্মীর তথ্য পূরণ করে সংরক্ষণ করুন।</p>
              </div>
              <button className="button secondary" type="button" onClick={closeForm}>
                বন্ধ করুন
              </button>
            </header>
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
                ইমেইল
                <input
                  name="employee_email"
                  type="email"
                  value={formState.employee_email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </label>
              <label className="field">
                জন্মতারিখ
                <input
                  name="dob"
                  type="date"
                  value={formState.dob}
                  onChange={handleChange}
                />
              </label>
              <label className="field">
                NID
                <input
                  name="nid"
                  value={formState.nid}
                  onChange={handleChange}
                  placeholder="NID নম্বর"
                />
              </label>
              <label className="field">
                লিঙ্গ
                <select name="gender" value={formState.gender} onChange={handleChange}>
                  <option value="">নির্বাচন করুন</option>
                  <option value="Male">পুরুষ</option>
                  <option value="Female">মহিলা</option>
                  <option value="Other">অন্যান্য</option>
                </select>
              </label>
              <label className="field">
                কর্মীর ধরন
                <select
                  name="employee_type"
                  value={formState.employee_type}
                  onChange={handleChange}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Daily">Daily</option>
                </select>
              </label>
              <label className="field">
                কর্মীর স্ট্যাটাস
                <select
                  name="employee_status"
                  value={formState.employee_status}
                  onChange={handleChange}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
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
              <label className="field">
                ব্যাংকের নাম
                <input
                  name="bank_name"
                  value={formState.bank_name}
                  onChange={handleChange}
                  placeholder="ব্যাংকের নাম"
                />
              </label>
              <label className="field">
                অ্যাকাউন্ট নম্বর
                <input
                  name="ac_no"
                  value={formState.ac_no}
                  onChange={handleChange}
                  placeholder="0000000000"
                />
              </label>
              <label className="field">
                যোগদানের তারিখ
                <input
                  name="joining_date"
                  type="date"
                  value={formState.joining_date}
                  onChange={handleChange}
                />
              </label>
              <label className="field">
                PRL তারিখ
                <input
                  name="prl_date"
                  type="date"
                  value={formState.prl_date}
                  onChange={handleChange}
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
              <div className="field">
                <span>অ্যাকশন</span>
                <div className="inline-actions">
                  <button className="button" type="submit">
                    {editingId ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                  </button>
                  <button className="button secondary" type="button" onClick={closeForm}>
                    বাতিল
                  </button>
                </div>
              </div>
            </form>
            {error && <p className="form-error">{error}</p>}
          </div>
        </div>
      )}

      <section className="section">
        <div className="table-toolbar">
          <div className="employee-count" aria-live="polite">
            <span>মোট কর্মী: {employees.length}</span>
            {normalizedSearch && (
              <span>মিলে: {filteredEmployees.length}</span>
            )}
          </div>
          <label className="field">
            <span>লাইভ সার্চ</span>
            <input
              name="employee_search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="নাম, PF, মোবাইল, বিভাগ..."
            />
          </label>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>নাম</th>
              <th>PF</th>
              <th>বিভাগ</th>
              <th>পদবী</th>
              <th>ব্লাড গ্রুপ</th>
              <th>মোবাইল</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8}>কোন কর্মী পাওয়া যায়নি।</td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8}>কোন মিল পাওয়া যায়নি।</td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.pf_number}</td>
                  <td>{emp.dept}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.blood_group || "-"}</td>
                  <td>{emp.mobile_number || "-"}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleView(emp)}
                      >
                        ভিউ
                      </button>
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
