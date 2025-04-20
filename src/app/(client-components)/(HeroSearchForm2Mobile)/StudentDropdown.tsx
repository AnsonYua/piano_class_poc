import React, { useState, useEffect } from "react";
import { ApiUtils } from "@/utils/ApiUtils";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

export interface StudentDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const StudentDropdown: React.FC<StudentDropdownProps> = ({ value, onChange }) => {
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const userType = UserTypeUtils.getUserTypeFromPathname(window.location.pathname);
        const url = ApiUtils.getUserProfileUrl(userType);
        const profile = await ApiUtils.makeAuthenticatedRequest(url, 'GET', null, userType);
        if (profile && profile.students && Array.isArray(profile.students)) {
          setStudents(profile.students.map((std: any) => ({
            id: std.id || std._id || std.name,
            name: std.name || std.fullName || "未命名學生"
          })));
        } else {
          setStudents([]);
        }
      } catch (err: any) {
        setError("無法獲取學生資料");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">學生</label>
      <select
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading || students.length === 0}
      >
        <option value="">請選擇學生</option>
        {students.map(student => (
          <option key={student.id} value={student.name}>{student.name}</option>
        ))}
      </select>
      {loading && <div className="text-xs text-neutral-400 mt-1">加載中...</div>}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      {(!loading && students.length === 0) && (
        <div className="text-xs text-neutral-400 mt-1">請先添加學生到您的個人資料</div>
      )}
    </div>
  );
};

export default StudentDropdown;
