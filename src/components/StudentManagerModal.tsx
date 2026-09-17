import React, { useState } from 'react';
import { Student } from '../types';
import { DUCK_COLORS, DUCK_ACCESSORIES, PRESET_CLASSES } from '../data/defaultStudents';
import { DuckSprite } from './DuckSprite';
import {
  Users,
  UserPlus,
  Trash2,
  RotateCcw,
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  UserCheck,
  X,
  Plus,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface StudentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  soundEnabled: boolean;
  selectedClass?: string;
}

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudents,
  soundEnabled,
  selectedClass,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'bulk' | 'eliminated'>('list');
  const [singleName, setSingleName] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const playClickSound = () => {
    if (soundEnabled) soundEffects.pop();
  };

  const activeStudents = students.filter((s) => !s.isEliminated);
  const eliminatedStudents = students.filter((s) => s.isEliminated);

  // Add single student
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;
    playClickSound();

    const randomColor = DUCK_COLORS[Math.floor(Math.random() * DUCK_COLORS.length)];
    const randomAccessory = DUCK_ACCESSORIES[Math.floor(Math.random() * DUCK_ACCESSORIES.length)];

    const newStudent: Student = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: singleName.trim(),
      color: randomColor,
      accessory: randomAccessory,
      isActive: true,
      isEliminated: false,
      winsCount: 0,
    };

    onUpdateStudents([...students, newStudent]);
    setSingleName('');
  };

  // Bulk add students
  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;
    playClickSound();

    // Split by lines or commas
    const rawNames = bulkText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const newStudents: Student[] = rawNames.map((name, i) => {
      const color = DUCK_COLORS[i % DUCK_COLORS.length];
      const accessory = DUCK_ACCESSORIES[i % DUCK_ACCESSORIES.length];
      return {
        id: Date.now().toString() + '-' + i + '-' + Math.random().toString(36).substring(2, 5),
        name,
        color,
        accessory,
        isActive: true,
        isEliminated: false,
        winsCount: 0,
      };
    });

    onUpdateStudents([...students, ...newStudents]);
    setBulkText('');
    setActiveTab('list');
  };

  // Load sample class preset
  const handleLoadPreset = (presetNames: string[]) => {
    playClickSound();
    const newStudents: Student[] = presetNames.map((name, i) => ({
      id: Date.now().toString() + '-' + i,
      name,
      color: DUCK_COLORS[i % DUCK_COLORS.length],
      accessory: DUCK_ACCESSORIES[i % DUCK_ACCESSORIES.length],
      isActive: true,
      isEliminated: false,
      winsCount: 0,
    }));
    onUpdateStudents(newStudents);
    setActiveTab('list');
  };

  // Toggle active status (tham gia / nghỉ tạm thời)
  const handleToggleActive = (id: string) => {
    playClickSound();
    onUpdateStudents(
      students.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Select / Deselect all active
  const handleToggleAllActive = (activate: boolean) => {
    playClickSound();
    onUpdateStudents(
      students.map((s) => (s.isEliminated ? s : { ...s, isActive: activate }))
    );
  };

  // Manually eliminate a student
  const handleEliminateStudent = (id: string) => {
    playClickSound();
    onUpdateStudents(
      students.map((s) =>
        s.id === id ? { ...s, isEliminated: true, calledAt: Date.now() } : s
      )
    );
  };

  // Restore eliminated student
  const handleRestoreStudent = (id: string) => {
    playClickSound();
    onUpdateStudents(
      students.map((s) =>
        s.id === id ? { ...s, isEliminated: false, isActive: true } : s
      )
    );
  };

  // Restore all eliminated students
  const handleRestoreAll = () => {
    playClickSound();
    onUpdateStudents(
      students.map((s) => ({ ...s, isEliminated: false, isActive: true }))
    );
  };

  // Delete student completely
  const handleDeleteStudent = (id: string) => {
    playClickSound();
    onUpdateStudents(students.filter((s) => s.id !== id));
  };

  // Clear all students
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách học sinh?')) {
      playClickSound();
      onUpdateStudents([]);
    }
  };

  // Filtered active list for searching
  const filteredActive = activeStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2">
            <div className="bg-amber-950/10 p-2 rounded-xl">
              <Users className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                <span>QUẢN LÝ DANH SÁCH HỌC SINH</span>
                {selectedClass && (
                  <span className="bg-amber-950 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-black">
                    LỚP {selectedClass}
                  </span>
                )}
              </h2>
              <p className="text-xs font-bold text-amber-900/80">
                Thêm, sửa, dán danh sách và quản lý các bạn đã được gọi
              </p>
            </div>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 text-amber-950 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-amber-50/50">
          <button
            id="tab-active-students"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all border-b-2 ${
              activeTab === 'list'
                ? 'bg-white border-amber-500 text-amber-950 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Sẵn sàng đua ({activeStudents.length})</span>
          </button>

          <button
            id="tab-bulk-add"
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all border-b-2 ${
              activeTab === 'bulk'
                ? 'bg-white border-amber-500 text-amber-950 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dán danh sách nhanh</span>
          </button>

          <button
            id="tab-eliminated-students"
            onClick={() => setActiveTab('eliminated')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold text-sm transition-all border-b-2 ${
              activeTab === 'eliminated'
                ? 'bg-white border-red-500 text-red-950 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Đã gọi / Đã loại ({eliminatedStudents.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {/* TAB 1: ACTIVE STUDENTS */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Add single input form */}
              <form onSubmit={handleAddSingle} className="flex gap-2">
                <input
                  id="input-single-name"
                  type="text"
                  placeholder="Nhập tên học sinh mới (ví dụ: Nguyễn Hoàng Anh)..."
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-semibold text-sm shadow-sm"
                />
                <button
                  id="btn-add-single"
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black rounded-xl shadow-md flex items-center gap-1.5 text-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm</span>
                </button>
              </form>

              {/* Action Bar: Selection, Presets, Clear */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-1 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAllActive(true)}
                    className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Chọn tất cả
                  </button>
                  <button
                    onClick={() => handleToggleAllActive(false)}
                    className="flex items-center gap-1 text-slate-700 hover:text-red-700 font-bold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <Square className="w-3.5 h-3.5 text-slate-400" /> Bỏ chọn tất cả
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tìm tên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none"
                  />
                  {activeStudents.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa hết
                    </button>
                  )}
                </div>
              </div>

              {/* Student Cards Grid */}
              {activeStudents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8">
                  <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-slate-700 text-base mb-1">
                    Chưa có học sinh nào trong danh sách đua!
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                    Thêm từng bạn ở ô bên trên, dán danh sách từ file hoặc chọn mẫu lớp học nhanh bên dưới.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {PRESET_CLASSES.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLoadPreset(preset.students)}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" /> {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredActive.map((student, idx) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        student.isActive
                          ? 'bg-white border-slate-200 shadow-sm hover:border-amber-400'
                          : 'bg-slate-100/80 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => handleToggleActive(student.id)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                          title={student.isActive ? 'Đang đua (Nhấn để tạm dừng)' : 'Tạm dừng (Nhấn để bật)'}
                        >
                          {student.isActive ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="w-8 h-8 flex-shrink-0">
                          <DuckSprite
                            color={student.color}
                            accessory={student.accessory}
                            size={32}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-slate-800 truncate">
                            {idx + 1}. {student.name}
                          </div>
                          {student.winsCount > 0 && (
                            <span className="text-[10px] text-amber-700 font-black bg-amber-100 px-1.5 py-0.2 rounded-full">
                              🏆 Thắng: {student.winsCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Eliminate button (Loại thủ công) */}
                        <button
                          onClick={() => handleEliminateStudent(student.id)}
                          title="Loại học sinh này khỏi vòng đua tiếp theo"
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          title="Xóa hẳn khỏi danh sách"
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BULK ADD */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Dán danh sách học sinh (mỗi bạn một dòng hoặc cách nhau bằng dấu phẩy)
                </label>
                <textarea
                  id="textarea-bulk-names"
                  rows={8}
                  placeholder={`Nguyễn Văn An\nTrần Thị Bích\nLê Hoàng Long\nPhạm Minh Khôi...`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none bg-white text-slate-800 text-sm font-semibold shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-bold text-slate-500">
                  {bulkText.trim() ? (
                    <span className="text-amber-700 font-extrabold">
                      ✨ Sẽ thêm{' '}
                      {
                        bulkText
                          .split(/[\n,]+/)
                          .map((n) => n.trim())
                          .filter((n) => n.length > 0).length
                      }{' '}
                      học sinh
                    </span>
                  ) : (
                    '💡 Gợi ý: Có thể sao chép trực tiếp từ cột tên trong Excel hoặc Google Sheets'
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBulkText('')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Xóa nội dung
                  </button>
                  <button
                    id="btn-confirm-bulk-add"
                    onClick={handleBulkAdd}
                    disabled={!bulkText.trim()}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 font-black rounded-xl shadow-md text-sm transition-all"
                  >
                    Thêm vào danh sách đua
                  </button>
                </div>
              </div>

              {/* Quick load presets */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-black text-slate-600 uppercase mb-2">
                  Hoặc nạp nhanh mẫu lớp học có sẵn:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PRESET_CLASSES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLoadPreset(preset.students)}
                      className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ELIMINATED STUDENTS (CÁC BẠN ĐÃ GỌI / ĐÃ LOẠI) */}
          {activeTab === 'eliminated' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-red-50 p-3 rounded-xl border border-red-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-extrabold text-red-950 text-sm">
                      Danh sách {eliminatedStudents.length} học sinh đã được gọi
                    </h4>
                    <p className="text-xs text-red-800/80">
                      Những bạn này sẽ không xuất hiện trong các lượt đua tiếp theo.
                    </p>
                  </div>
                </div>

                {eliminatedStudents.length > 0 && (
                  <button
                    id="btn-restore-all"
                    onClick={handleRestoreAll}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Khôi phục tất cả
                  </button>
                )}
              </div>

              {eliminatedStudents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8">
                  <p className="text-slate-500 font-bold text-sm">
                    Chưa có học sinh nào bị loại hoặc được gọi tên!
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Khi bật chế độ &quot;Loại tên học sinh đã gọi&quot;, bạn thắng cuộc đua sẽ tự động được chuyển vào đây.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto">
                  {eliminatedStudents.map((student, idx) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 flex-shrink-0 opacity-70">
                          <DuckSprite
                            color={student.color}
                            accessory={student.accessory}
                            size={32}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-800 line-through truncate">
                            {idx + 1}. {student.name}
                          </div>
                          {student.calledAt && (
                            <span className="text-[10px] text-slate-400">
                              Đã gọi {new Date(student.calledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestoreStudent(student.id)}
                        title="Khôi phục bạn này lại đường đua"
                        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Trả lại
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            Tổng cộng: <strong className="text-amber-800">{students.length}</strong> học sinh ({activeStudents.length} sẵn sàng đua, {eliminatedStudents.length} đã gọi)
          </span>
          <button
            id="btn-done-modal"
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black rounded-xl text-sm shadow-sm transition-all"
          >
            Hoàn tất & Quay lại đua
          </button>
        </div>
      </div>
    </div>
  );
};
