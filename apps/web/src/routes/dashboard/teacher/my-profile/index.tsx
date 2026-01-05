// "use client"

// import { useState } from "react"
// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/dashboard/teacher/my-profile/')({
//   component: RouteComponent,
// })

// // Avatar Component
// function ProfileAvatar({ image, name }: { image: string; name: string }) {
//   return (
//     <div className="relative">
//       {image ? (
//         <img
//           src={image || "/placeholder.svg"}
//           alt={name}
//           className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//         />
//       ) : (
//         <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border-4 border-white shadow-lg">
//           <span className="text-4xl font-bold text-white">{name?.charAt(0)?.toUpperCase() || "?"}</span>
//         </div>
//       )}
//       <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white"></div>
//     </div>
//   )
// }

// // Info Item Component
// function InfoItem({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
//   return (
//     <div className="space-y-1">
//       <p className="text-sm text-muted-foreground flex items-center gap-2">
//         {icon && <span>{icon}</span>}
//         {label}
//       </p>
//       <p className="font-medium text-foreground">{value || "N/A"}</p>
//     </div>
//   )
// }

// // Status Badge Component
// function StatusBadge({ status, verified }: { status: string; verified: boolean }) {
//   const statusColors = {
//     ACTIVE:
//       "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
//     INACTIVE: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800",
//     ON_LEAVE:
//       "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
//     SUSPENDED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
//   }

//   return (
//     <div className="flex flex-wrap gap-2">
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE}`}
//       >
//         {status}
//       </span>
//       {verified && (
//         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1">
//           ✓ Verified
//         </span>
//       )}
//     </div>
//   )
// }

// // Badge List Component
// function BadgeList({ items, label, icon }: { items: string[]; label: string; icon?: string }) {
//   return (
//     <div className="space-y-3">
//       <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//         {icon && <span>{icon}</span>}
//         {label}
//       </p>
//       <div className="flex flex-wrap gap-2">
//         {items && items.length > 0 ? (
//           items.map((item, idx) => (
//             <span
//               key={idx}
//               className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium dark:bg-orange-900/30 dark:text-orange-400"
//             >
//               {item}
//             </span>
//           ))
//         ) : (
//           <span className="text-sm text-muted-foreground">None</span>
//         )}
//       </div>
//     </div>
//   )
// }

// const mockTeacher = {
//   id: "TCH001",
//   name: "Dr. James Anderson",
//   email: "james.anderson@university.edu",
//   password: "hashed_password_here",
//   phone: "+1 (555) 234-5678",
//   address: "456 Maple Avenue, Boston, MA 02108",
//   qualifications: "PhD in Computer Science, M.Tech in Software Engineering",
//   experienceYears: 8,
//   certifications: ["ISO 9001 Certified", "Advanced Java Certification", "Agile Scrum Master"],
//   subjects: ["Data Structures", "Algorithms", "Web Development", "Database Management"],
//   bio: "Passionate educator with 8+ years of experience in teaching computer science. I focus on making complex concepts simple and engaging for students.",
//   image: "/professional-teacher-avatar.jpg",
//   isVerified: true,
//   isStaff: true,
//   employmentStatus: "ACTIVE" as const,
//   departmentAssigned: "Computer Science",
//   classesAssigned: 4,
//   totalStudents: 120,
//   createdAt: "2019-08-20",
//   updatedAt: "2024-01-15",
// }

// function RouteComponent() {
//   const [teacher, setTeacher] = useState(mockTeacher)

//   const [isEditingPersonal, setIsEditingPersonal] = useState(false)
//   const [isEditingProfessional, setIsEditingProfessional] = useState(false)
//   const [isEditingAcademic, setIsEditingAcademic] = useState(false)

//   const [personalForm, setPersonalForm] = useState({
//     name: teacher.name,
//     email: teacher.email,
//     phone: teacher.phone,
//     address: teacher.address,
//     bio: teacher.bio,
//   })

//   const [professionalForm, setProfessionalForm] = useState({
//     departmentAssigned: teacher.departmentAssigned,
//     experienceYears: teacher.experienceYears,
//     classesAssigned: teacher.classesAssigned,
//   })

//   const [academicForm, setAcademicForm] = useState({
//     qualifications: teacher.qualifications,
//     certifications: teacher.certifications.join(", "),
//     subjects: teacher.subjects.join(", "),
//   })

//   const handlePersonalChange = (field: string, value: string | number) => {
//     setPersonalForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleProfessionalChange = (field: string, value: string | number) => {
//     setProfessionalForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleAcademicChange = (field: string, value: string) => {
//     setAcademicForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSavePersonal = () => {
//     setTeacher((prev) => ({
//       ...prev,
//       ...personalForm,
//     }))
//     setIsEditingPersonal(false)
//   }

//   const handleCancelPersonal = () => {
//     setPersonalForm({
//       name: teacher.name,
//       email: teacher.email,
//       phone: teacher.phone,
//       address: teacher.address,
//       bio: teacher.bio,
//     })
//     setIsEditingPersonal(false)
//   }

//   const handleSaveProfessional = () => {
//     setTeacher((prev) => ({
//       ...prev,
//       ...professionalForm,
//     }))
//     setIsEditingProfessional(false)
//   }

//   const handleCancelProfessional = () => {
//     setProfessionalForm({
//       departmentAssigned: teacher.departmentAssigned,
//       experienceYears: teacher.experienceYears,
//       classesAssigned: teacher.classesAssigned,
//     })
//     setIsEditingProfessional(false)
//   }

//   const handleSaveAcademic = () => {
//     setTeacher((prev) => ({
//       ...prev,
//       qualifications: academicForm.qualifications,
//       certifications: academicForm.certifications
//         .split(",")
//         .map((c) => c.trim())
//         .filter(Boolean),
//       subjects: academicForm.subjects
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean),
//     }))
//     setIsEditingAcademic(false)
//   }

//   const handleCancelAcademic = () => {
//     setAcademicForm({
//       qualifications: teacher.qualifications,
//       certifications: teacher.certifications.join(", "),
//       subjects: teacher.subjects.join(", "),
//     })
//     setIsEditingAcademic(false)
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="space-y-6 pb-8 max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-4xl font-bold text-pretty">Teacher Profile</h1>
//             <p className="text-muted-foreground">View and manage your professional information</p>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//             <ProfileAvatar image={teacher.image} name={teacher.name} />

//             <div className="flex-1 text-center md:text-left space-y-3">
//               <div>
//                 <h2 className="text-4xl font-bold">{teacher.name}</h2>
//                 <p className="text-amber-100 text-lg">{teacher.departmentAssigned} Department</p>
//               </div>

//               <StatusBadge status={teacher.employmentStatus} verified={teacher.isVerified} />

//               <div className="flex flex-wrap gap-4 pt-2">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-amber-100">Experience</p>
//                   <p className="text-2xl font-bold">{teacher.experienceYears} yrs</p>
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-amber-100">Classes</p>
//                   <p className="text-2xl font-bold">{teacher.classesAssigned}</p>
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-amber-100">Students</p>
//                   <p className="text-2xl font-bold">{teacher.totalStudents}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Information Grid */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">👤 Personal Information</h3>
//               {!isEditingPersonal && (
//                 <button
//                   onClick={() => setIsEditingPersonal(true)}
//                   className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingPersonal ? (
//               <div className="space-y-4">
//                 <InfoItem label="Full Name" value={teacher.name} icon="📝" />
//                 <InfoItem label="Email Address" value={teacher.email} icon="📧" />
//                 <InfoItem label="Phone Number" value={teacher.phone} icon="📱" />
//                 <InfoItem label="Address" value={teacher.address} icon="🏠" />
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground flex items-center gap-2">📖 Bio</p>
//                   <p className="text-sm leading-relaxed text-foreground">{teacher.bio}</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm text-muted-foreground">Full Name</label>
//                   <input
//                     type="text"
//                     value={personalForm.name}
//                     onChange={(e) => handlePersonalChange("name", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Email Address</label>
//                   <input
//                     type="email"
//                     value={personalForm.email}
//                     onChange={(e) => handlePersonalChange("email", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Phone Number</label>
//                   <input
//                     type="tel"
//                     value={personalForm.phone}
//                     onChange={(e) => handlePersonalChange("phone", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Address</label>
//                   <input
//                     type="text"
//                     value={personalForm.address}
//                     onChange={(e) => handlePersonalChange("address", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Bio</label>
//                   <textarea
//                     value={personalForm.bio}
//                     onChange={(e) => handlePersonalChange("bio", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-24"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     onClick={handleSavePersonal}
//                     className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelPersonal}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Professional Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">💼 Professional Information</h3>
//               {!isEditingProfessional && (
//                 <button
//                   onClick={() => setIsEditingProfessional(true)}
//                   className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingProfessional ? (
//               <div className="space-y-4">
//                 <InfoItem label="Department" value={teacher.departmentAssigned} icon="🏢" />
//                 <InfoItem label="Employment Status" value={teacher.employmentStatus} icon="📋" />
//                 <InfoItem label="Years of Experience" value={`${teacher.experienceYears} years`} icon="⏱️" />
//                 <InfoItem label="Classes Assigned" value={teacher.classesAssigned} icon="🎓" />
//                 <InfoItem label="Total Students" value={teacher.totalStudents} icon="👥" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm text-muted-foreground">Department</label>
//                   <input
//                     type="text"
//                     value={professionalForm.departmentAssigned}
//                     onChange={(e) => handleProfessionalChange("departmentAssigned", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Years of Experience</label>
//                   <input
//                     type="number"
//                     value={professionalForm.experienceYears}
//                     onChange={(e) => handleProfessionalChange("experienceYears", Number.parseInt(e.target.value))}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Classes Assigned</label>
//                   <input
//                     type="number"
//                     value={professionalForm.classesAssigned}
//                     onChange={(e) => handleProfessionalChange("classesAssigned", Number.parseInt(e.target.value))}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     onClick={handleSaveProfessional}
//                     className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelProfessional}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Academic Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm md:col-span-2">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">📚 Academic Information</h3>
//               {!isEditingAcademic && (
//                 <button
//                   onClick={() => setIsEditingAcademic(true)}
//                   className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingAcademic ? (
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">🎓 Qualifications</p>
//                   <p className="text-sm leading-relaxed text-foreground">{teacher.qualifications}</p>
//                 </div>
//                 <BadgeList items={teacher.certifications} label="Certifications" icon="🏆" />
//                 <BadgeList items={teacher.subjects} label="Subjects Taught" icon="📖" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm text-muted-foreground">Qualifications</label>
//                   <textarea
//                     value={academicForm.qualifications}
//                     onChange={(e) => handleAcademicChange("qualifications", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-20"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">Enter qualifications separated by commas</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Certifications</label>
//                   <textarea
//                     value={academicForm.certifications}
//                     onChange={(e) => handleAcademicChange("certifications", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-20"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">Enter certifications separated by commas</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Subjects Taught</label>
//                   <textarea
//                     value={academicForm.subjects}
//                     onChange={(e) => handleAcademicChange("subjects", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-20"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">Enter subjects separated by commas</p>
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     onClick={handleSaveAcademic}
//                     className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelAcademic}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 justify-center pt-4">
//           <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-md">
//             Download Profile
//           </button>
//           <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
//             Print Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

