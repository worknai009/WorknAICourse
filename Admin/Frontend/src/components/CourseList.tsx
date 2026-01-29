import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Check, ChevronDown, ChevronRight, Video, List, BookOpen, Clock, TrendingUp, Folder, Upload, Loader2, Link as LinkIcon } from 'lucide-react';

interface TechnicalSpec {
  label: string;
  value: string;
  icon: string;
  _id?: string;
}

interface Resource {
  title: string;
  url: string;
  type: 'link' | 'pdf' | 'zip' | 'doc';
  _id?: string;
}

interface Video {
  url: string;
  provider: string;
  duration: number;
  isPreview: boolean;
}

interface Topic {
  name: string;
  video: Video;
  _id?: string;
}

interface Week {
  label: string;
  title: string;
  topics: Topic[];
  _id?: string;
}

interface SyllabusPhase {
  month: string;
  title: string;
  desc: string;
  weeks: Week[];
  _id?: string;
}

interface Course {
  _id?: string;
  id: string;
  name: string;
  description: string;
  status: 'Online' | 'Offline' | 'Hybrid';
  language: string;
  originalPrice: number;
  discountedPrice: number;
  technicalSpecs: TechnicalSpec[];
  syllabusPhases: SyllabusPhase[];
  resources: Resource[];
  certificateImage: string;
  isActive: boolean;
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const initialFormData: Course = {
    id: '',
    name: '',
    description: '',
    status: 'Online',
    language: 'English',
    originalPrice: 0,
    discountedPrice: 0,
    technicalSpecs: [],
    syllabusPhases: [],
    resources: [],
    certificateImage: '',
    isActive: true
  };

  const [formData, setFormData] = useState<Course>(initialFormData);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses', err);
    }
  };

  const handleOpenModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        ...course,
        technicalSpecs: course.technicalSpecs || [],
        syllabusPhases: course.syllabusPhases || [],
        resources: course.resources || []
      });
    } else {
      setEditingCourse(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error('Error saving course', err);
      alert('Failed to save course. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course? All syllabus data will be lost.')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err: any) {
        console.error('Error deleting course', err);
      }
    }
  };

  // --- Dynamic Field Handlers ---

  const addTechSpec = () => {
    setFormData({
      ...formData,
      technicalSpecs: [...formData.technicalSpecs, { label: '', value: '', icon: 'clock' }]
    });
  };

  const removeTechSpec = (index: number) => {
    const specs = [...formData.technicalSpecs];
    specs.splice(index, 1);
    setFormData({ ...formData, technicalSpecs: specs });
  };

  const addPhase = () => {
    setFormData({
      ...formData,
      syllabusPhases: [
        ...formData.syllabusPhases, 
        { month: `Month ${formData.syllabusPhases.length + 1}`, title: '', desc: '', weeks: [] }
      ]
    });
  };

  const updatePhase = (pIdx: number, field: string, value: any) => {
    const phases = [...formData.syllabusPhases];
    phases[pIdx] = { ...phases[pIdx], [field]: value };
    setFormData({ ...formData, syllabusPhases: phases });
  };

  const addWeek = (pIdx: number) => {
    const phases = [...formData.syllabusPhases];
    phases[pIdx].weeks.push({ label: `Week ${phases[pIdx].weeks.length + 1}`, title: '', topics: [] });
    setFormData({ ...formData, syllabusPhases: phases });
  };

  const addTopic = (pIdx: number, wIdx: number) => {
    const phases = [...formData.syllabusPhases];
    phases[pIdx].weeks[wIdx].topics.push({ 
        name: '', 
        video: { url: '', provider: 'cloudinary', duration: 0, isPreview: false } 
    });
    setFormData({ ...formData, syllabusPhases: phases });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { title: '', url: '', type: 'link' }]
    });
  };

  const removeResource = (index: number) => {
    const res = [...formData.resources];
    res.splice(index, 1);
    setFormData({ ...formData, resources: res });
  };

  const handleFileUpload = async (index: number, file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    setUploadingIndex(index);
    try {
      const res = await api.post('/upload/resource', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newResources = [...formData.resources];
      newResources[index].url = res.data.url;
      if (!newResources[index].title) {
        newResources[index].title = res.data.filename;
      }
      // Auto-detect type from extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'zip', 'doc', 'docx'].includes(ext || '')) {
        newResources[index].type = (ext === 'docx' ? 'doc' : ext) as any;
      }
      
      setFormData({ ...formData, resources: newResources });
    } catch (err) {
      console.error('Upload failed', err);
      alert('File upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses Inventory</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all your educational programs and their complex structures here.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={20} /> New Program
        </button>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#0a0a0a]">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-5 font-semibold">Course Detail</th>
              <th className="p-5 font-semibold text-center">Modules</th>
              <th className="p-5 font-semibold">Pricing</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {courses.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 italic">No courses found. Start by creating one.</td>
                </tr>
            ) : courses.map((course: Course) => (
              <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-5">
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{course.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{course.id}</div>
                </td>
                <td className="p-5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                        <BookOpen size={14} />
                        {course.syllabusPhases?.length || 0} Phases
                    </div>
                </td>
                <td className="p-5">
                    <div className="flex flex-col">
                        <span className="text-white font-bold">₹{course.discountedPrice?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 line-through">₹{course.originalPrice?.toLocaleString()}</span>
                    </div>
                </td>
                <td className="p-5">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                    course.status === 'Online' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                    course.status === 'Hybrid' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                    'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(course)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(course._id!)} className="p-2 hover:bg-white/10 rounded-lg text-red-500 transition-colors" title="Delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-5xl my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                <div>
                    <h3 className="text-2xl font-bold text-white">{editingCourse ? 'Studio: Editing Course' : 'Studio: Create Program'}</h3>
                    <p className="text-gray-400 text-sm">Configure everything from basics to full syllabus.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12">
              
              {/* SECTION: BASICS */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Folder size={20} />
                    </div>
                    <h4 className="text-lg font-bold">General Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Program ID</label>
                        <input 
                            value={formData.id} 
                            onChange={(e) => setFormData({...formData, id: e.target.value})}
                            placeholder="e.g., MERN-101"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all" 
                            required 
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                        <input 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="MERN Stack Development"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all" 
                            required 
                        />
                    </div>
                    <div className="col-span-full space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Provide a detailed overview of the program..."
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white/[0.08] transition-all h-28" 
                            required 
                        />
                    </div>
                </div>
              </section>

              {/* SECTION: CONFIG & PRICING */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="text-lg font-bold">Settings & Localization</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                            <select 
                                value={formData.status} 
                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Language</label>
                            <input 
                                value={formData.language} 
                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                                placeholder="Hinglish / English"
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" 
                                required 
                            />
                        </div>
                        <div className="col-span-full space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Certificate Image URL</label>
                            <input 
                                value={formData.certificateImage} 
                                onChange={(e) => setFormData({...formData, certificateImage: e.target.value})}
                                placeholder="Cloudinary/Image URL"
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Clock size={20} />
                        </div>
                        <h4 className="text-lg font-bold">Pricing Model</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Original (INR)</label>
                            <input 
                                type="number"
                                value={formData.originalPrice} 
                                onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none" 
                                required 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Discounted (INR)</label>
                            <input 
                                type="number"
                                value={formData.discountedPrice} 
                                onChange={(e) => setFormData({...formData, discountedPrice: Number(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none border-blue-500/30" 
                                required 
                            />
                        </div>
                        <div className="col-span-full pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                                <span className="font-bold text-sm">Course Visible to Students</span>
                                <input 
                                    type="checkbox"
                                    hidden
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                />
                            </label>
                        </div>
                    </div>
                </div>
              </section>

              {/* SECTION: TECHNICAL SPECS */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <List size={20} />
                        </div>
                        <h4 className="text-lg font-bold">Technical Specifications</h4>
                    </div>
                    <button type="button" onClick={addTechSpec} className="text-xs font-bold text-blue-500 hover:text-blue-400">Add Specification +</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.technicalSpecs.map((spec: TechnicalSpec, index: number) => (
                        <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 relative group">
                            <div className="space-y-1 flex-1">
                                <input 
                                    value={spec.label} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const specs = [...formData.technicalSpecs];
                                        specs[index].label = e.target.value;
                                        setFormData({...formData, technicalSpecs: specs});
                                    }}
                                    placeholder="Label (e.g. Duration)"
                                    className="bg-transparent outline-none w-full text-sm font-bold placeholder:text-gray-600"
                                />
                                <input 
                                    value={spec.value} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const specs = [...formData.technicalSpecs];
                                        specs[index].value = e.target.value;
                                        setFormData({...formData, technicalSpecs: specs});
                                    }}
                                    placeholder="Value (e.g. 6 Months)"
                                    className="bg-transparent outline-none w-full text-xs text-gray-400"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select 
                                    value={spec.icon}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const specs = [...formData.technicalSpecs];
                                        specs[index].icon = e.target.value;
                                        setFormData({...formData, technicalSpecs: specs});
                                    }}
                                    className="bg-black/50 border border-white/10 rounded-lg p-1 text-xs"
                                >
                                    <option value="clock">Clock</option>
                                    <option value="trending-up">Level</option>
                                    <option value="folder">Projects</option>
                                    <option value="book">Content</option>
                                </select>
                                <button type="button" onClick={() => removeTechSpec(index)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              </section>

              {/* SECTION: RESOURCES */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <BookOpen size={20} />
                        </div>
                        <h4 className="text-lg font-bold">Supplemental Resources</h4>
                    </div>
                    <button type="button" onClick={addResource} className="text-xs font-bold text-blue-500 hover:text-blue-400">Add Resource +</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.resources.map((resource: Resource, index: number) => (
                        <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 relative group">
                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="space-y-1">
                                    <input 
                                        value={resource.title} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const res = [...formData.resources];
                                            res[index].title = e.target.value;
                                            setFormData({...formData, resources: res});
                                        }}
                                        placeholder="Resource Title (e.g. Source Code)"
                                        className="bg-transparent outline-none w-full text-sm font-bold placeholder:text-gray-600"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input 
                                            value={resource.url} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const res = [...formData.resources];
                                                res[index].url = e.target.value;
                                                setFormData({...formData, resources: res});
                                            }}
                                            placeholder="Download Link / URL"
                                            className="bg-transparent outline-none flex-grow text-[10px] text-gray-500 font-mono"
                                        />
                                        <label className="cursor-pointer p-1.5 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg text-blue-500 transition-colors" title="Upload File">
                                            {uploadingIndex === index ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Upload size={14} />
                                            )}
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(index, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select 
                                    value={resource.type}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const res = [...formData.resources];
                                        res[index].type = e.target.value as any;
                                        setFormData({...formData, resources: res});
                                    }}
                                    className="bg-black/50 border border-white/10 rounded-lg p-1 text-xs"
                                >
                                    <option value="link">Link</option>
                                    <option value="pdf">PDF</option>
                                    <option value="zip">ZIP</option>
                                    <option value="doc">DOC</option>
                                </select>
                                <button type="button" onClick={() => removeResource(index)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {formData.resources.length === 0 && (
                        <div className="col-span-full p-6 text-center border-2 border-dashed border-white/5 rounded-2xl text-gray-600 text-xs">
                            No resources added. Use these for supplementary downloads or external links.
                        </div>
                    )}
                </div>
              </section>

              {/* SECTION: SYLLABUS (MOST COMPLEX) */}
              <section className="space-y-8">
                <div className="flex justify-between items-center bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Curriculum Studio</h4>
                            <p className="text-sm text-gray-400">Build your month-by-month learning journey.</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={addPhase}
                        className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-white/10 hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Add Phase
                    </button>
                </div>

                <div className="space-y-6">
                    {formData.syllabusPhases.map((phase, pIdx) => (
                        <div key={pIdx} className="border border-white/10 rounded-3xl overflow-hidden bg-[#111]">
                            {/* Phase Header */}
                            <div className="p-6 bg-white/[0.03] flex items-center gap-6 border-b border-white/10">
                                <div className="text-center bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20 min-w-[100px]">
                                    <input 
                                        value={phase.month} 
                                        onChange={(e) => updatePhase(pIdx, 'month', e.target.value)}
                                        className="bg-transparent outline-none font-bold text-blue-500 text-center w-full"
                                    />
                                    <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-tighter">Phase Tag</div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input 
                                        value={phase.title} 
                                        onChange={(e) => updatePhase(pIdx, 'title', e.target.value)}
                                        placeholder="Phase Title (e.g. Master React Basics)"
                                        className="bg-transparent outline-none w-full text-lg font-bold placeholder:text-gray-700"
                                    />
                                    <input 
                                        value={phase.desc} 
                                        onChange={(e) => updatePhase(pIdx, 'desc', e.target.value)}
                                        placeholder="Brief description of this month's goals..."
                                        className="bg-transparent outline-none w-full text-sm text-gray-500 placeholder:text-gray-800"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button type="button" onClick={() => addWeek(pIdx)} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 text-xs font-bold transition-all">Add Week +</button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const phases = [...formData.syllabusPhases];
                                            phases.splice(pIdx, 1);
                                            setFormData({...formData, syllabusPhases: phases});
                                        }}
                                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Weeks in Phase */}
                            <div className="p-6 space-y-6 bg-black/40">
                                {phase.weeks.map((week, wIdx) => (
                                    <div key={wIdx} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                        <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
                                            <div className="flex items-center gap-4 flex-1">
                                                <input 
                                                    value={week.label} 
                                                    onChange={(e) => {
                                                        const phases = [...formData.syllabusPhases];
                                                        phases[pIdx].weeks[wIdx].label = e.target.value;
                                                        setFormData({...formData, syllabusPhases: phases});
                                                    }}
                                                    className="w-20 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-gray-400"
                                                />
                                                <input 
                                                    value={week.title} 
                                                    onChange={(e) => {
                                                        const phases = [...formData.syllabusPhases];
                                                        phases[pIdx].weeks[wIdx].title = e.target.value;
                                                        setFormData({...formData, syllabusPhases: phases});
                                                    }}
                                                    placeholder="Week Title..."
                                                    className="bg-transparent outline-none text-sm font-bold flex-1"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => addTopic(pIdx, wIdx)} className="text-xs font-bold text-blue-400">Add Topic +</button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const phases = [...formData.syllabusPhases];
                                                        phases[pIdx].weeks.splice(wIdx, 1);
                                                        setFormData({...formData, syllabusPhases: phases});
                                                    }}
                                                    className="text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Topics in Week */}
                                        <div className="p-4 space-y-3">
                                            {week.topics.map((topic, tIdx) => (
                                                <div key={tIdx} className="grid grid-cols-12 gap-4 items-center bg-black/20 p-3 rounded-xl border border-white/5 group">
                                                    <div className="col-span-12 md:col-span-5">
                                                        <input 
                                                            value={topic.name} 
                                                            onChange={(e) => {
                                                                const phases = [...formData.syllabusPhases];
                                                                phases[pIdx].weeks[wIdx].topics[tIdx].name = e.target.value;
                                                                setFormData({...formData, syllabusPhases: phases});
                                                            }}
                                                            placeholder="Topic: e.g. Intro to JSX"
                                                            className="w-full bg-white/5 border border-white/5 p-2 rounded-lg text-xs outline-none focus:border-blue-500/50"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-6 flex gap-2">
                                                        <input 
                                                            value={topic.video.url} 
                                                            onChange={(e) => {
                                                                const phases = [...formData.syllabusPhases];
                                                                phases[pIdx].weeks[wIdx].topics[tIdx].video.url = e.target.value;
                                                                setFormData({...formData, syllabusPhases: phases});
                                                            }}
                                                            placeholder="Video URL (Cloudinary Embed preferred)"
                                                            className="flex-1 bg-white/5 border border-white/5 p-2 rounded-lg text-[10px] outline-none"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-[10px] text-gray-500 flex items-center gap-1 cursor-pointer">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={topic.video.isPreview}
                                                                    onChange={(e) => {
                                                                        const phases = [...formData.syllabusPhases];
                                                                        phases[pIdx].weeks[wIdx].topics[tIdx].video.isPreview = e.target.checked;
                                                                        setFormData({...formData, syllabusPhases: phases});
                                                                    }}
                                                                />
                                                                Preview
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-12 md:col-span-1 flex justify-center">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => {
                                                                const phases = [...formData.syllabusPhases];
                                                                phases[pIdx].weeks[wIdx].topics.splice(tIdx, 1);
                                                                setFormData({...formData, syllabusPhases: phases});
                                                            }}
                                                            className="p-1 text-gray-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              </section>

              {/* STICKY FOOTER ACTION */}
              <div className="sticky bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 p-6 flex justify-end gap-6 mt-12 z-50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-bold border border-white/10 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                >
                  {editingCourse ? 'Save Changes' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
