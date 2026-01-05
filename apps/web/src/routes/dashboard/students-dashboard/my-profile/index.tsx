// // export interface Student {
// //   id: string;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   address: string;
// //   image: string;
// //   isVerified: boolean;
// //   isStaff: boolean;
// //   grade: string;
// //   class: string;
// //   section: string;
// //   currentLevel: string;
// //   gpa: number;
// //   totalCredits: number;
// //   academicStatus: "ACTIVE" | "PROBATION" | "GRADUATED";
// //   guardianName: string;
// //   guardianPhone: string;
// //   guardianEmail: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }
// // // Avatar Component
// // function ProfileAvatar({ image, name }: { image: string; name: string }) {
// //   return (
// //     <div className="relative">
// //       {image ? (
// //         <img
// //           src={image}
// //           alt={name}
// //           className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
// //         />
// //       ) : (
// //         <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
// //           <span className="text-4xl font-bold text-white">
// //             {name?.charAt(0)?.toUpperCase() || "?"}
// //           </span>
// //         </div>
// //       )}
// //       <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
// //     </div>
// //   );
// // }

// // // Info Item Component
// // function InfoItem({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
// //   return (
// //     <div className="space-y-1">
// //       <p className="text-sm text-muted-foreground flex items-center gap-2">
// //         {icon && <span>{icon}</span>}
// //         {label}
// //       </p>
// //       <p className="font-medium text-foreground">{value || "N/A"}</p>
// //     </div>
// //   );
// // }

// // // Status Badge Component
// // function StatusBadge({ status, verified }: { status: string; verified: boolean }) {
// //   const statusColors = {
// //     ACTIVE: "bg-green-100 text-green-800 border-green-200",
// //     PROBATION: "bg-gray-100 text-gray-800 border-gray-200",
// //     GRADUATED: "bg-blue-100 text-blue-800 border-blue-200",
// //   };

// //   return (
// //     <div className="flex gap-2">
// //       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE}`}>
// //         {status}
// //       </span>
// //       {verified && (
// //         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
// //           ✓ Verified
// //         </span>
// //       )}
// //     </div>
// //   );
// // }
// // "use client";

// // import { useGetStudentProfile } from "@/hooks/user-management";
// // import { createFileRoute } from "@tanstack/react-router";

// // export const Route = createFileRoute(
// //   "/dashboard/students-dashboard/my-profile/"
// // )({
// //   component: MyProfilePage,
// // });

// // function MyProfilePage() {
// //   // Get studentId from your auth context or store
// //   const studentId = "current-student-id"; // Replace with actual studentId from context/store

// //   const { student, loading, error, refetch, isRefetching } = useGetStudentProfile(studentId);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <div className="text-center space-y-4">
// //           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
// //           <p className="text-muted-foreground">Loading profile...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <div className="text-center space-y-4 max-w-md">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
// //             <span className="text-2xl">⚠️</span>
// //           </div>
// //           <h3 className="text-xl font-semibold">Failed to load profile</h3>
// //           <p className="text-muted-foreground">{error.message}</p>
// //           <button
// //             onClick={() => refetch()}
// //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!student) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <p className="text-muted-foreground">No profile data available</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6 pb-8">
// //       {/* Header */}
// //       <div className="flex justify-between items-start">
// //         <div>
// //           <h1 className="text-3xl font-bold">My Profile</h1>
// //           <p className="text-muted-foreground">
// //             View and manage your personal information
// //           </p>
// //         </div>
// //         <button
// //           onClick={() => refetch()}
// //           disabled={isRefetching}
// //           className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           {isRefetching ? "⏳ Refreshing..." : "🔄 Refresh"}
// //         </button>
// //       </div>

// //       {/* Profile Header Card */}
// //       <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
// //         <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
// //           <ProfileAvatar image={student.image} name={student.name} />

// //           <div className="flex-1 text-center md:text-left space-y-3">
// //             <div>
// //               <h2 className="text-3xl font-bold">{student.name}</h2>
// //               <p className="text-blue-100">{student.email}</p>
// //             </div>

// //             <StatusBadge status={student.academicStatus} verified={student.isVerified} />

// //             <div className="flex flex-wrap gap-4 pt-2">
// //               <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
// //                 <p className="text-xs text-blue-100">GPA</p>
// //                 <p className="text-2xl font-bold">{student.gpa.toFixed(2)}</p>
// //               </div>
// //               <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
// //                 <p className="text-xs text-blue-100">Total Credits</p>
// //                 <p className="text-2xl font-bold">{student.totalCredits}</p>
// //               </div>
// //               <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
// //                 <p className="text-xs text-blue-100">Grade</p>
// //                 <p className="text-2xl font-bold">{student.grade}</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Information Grid */}
// //       <div className="grid md:grid-cols-2 gap-6">
// //         {/* Personal Information */}
// //         <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
// //           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //             👤 Personal Information
// //           </h3>
// //           <div className="space-y-4">
// //             <InfoItem label="Full Name" value={student.name} icon="📝" />
// //             <InfoItem label="Email Address" value={student.email} icon="📧" />
// //             <InfoItem label="Phone Number" value={student.phone} icon="📱" />
// //             <InfoItem label="Address" value={student.address} icon="🏠" />
// //             <InfoItem
// //               label="Account Type"
// //               value={student.isStaff ? "Staff Member" : "Student"}
// //               icon="🎓"
// //             />
// //           </div>
// //         </div>

// //         {/* Academic Information */}
// //         <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
// //           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //             📚 Academic Information
// //           </h3>
// //           <div className="space-y-4">
// //             <InfoItem label="Grade" value={student.grade} icon="🎯" />
// //             <InfoItem label="Class" value={student.class} icon="🏫" />
// //             <InfoItem label="Section" value={student.section} icon="📑" />
// //             <InfoItem label="Current Level" value={student.currentLevel} icon="📊" />
// //             <InfoItem label="GPA" value={student.gpa.toFixed(2)} icon="⭐" />
// //             <InfoItem label="Total Credits" value={student.totalCredits} icon="🏆" />
// //           </div>
// //         </div>

// //         {/* Guardian Information */}
// //         <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
// //           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //             👨‍👩‍👧 Guardian Information
// //           </h3>
// //           <div className="space-y-4">
// //             <InfoItem label="Guardian Name" value={student.guardianName} icon="👤" />
// //             <InfoItem label="Guardian Phone" value={student.guardianPhone} icon="📱" />
// //             <InfoItem label="Guardian Email" value={student.guardianEmail} icon="📧" />
// //           </div>
// //         </div>

// //         {/* Account Status */}
// //         <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
// //           <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //             ⚙️ Account Status
// //           </h3>
// //           <div className="space-y-4">
// //             <InfoItem
// //               label="Academic Status"
// //               value={student.academicStatus}
// //               icon="📋"
// //             />
// //             <InfoItem
// //               label="Verification Status"
// //               value={student.isVerified ? "Verified ✓" : "Not Verified"}
// //               icon="✅"
// //             />
// //             {student.createdAt && (
// //               <InfoItem
// //                 label="Member Since"
// //                 value={new Date(student.createdAt).toLocaleDateString()}
// //                 icon="📅"
// //               />
// //             )}
// //             {student.updatedAt && (
// //               <InfoItem
// //                 label="Last Updated"
// //                 value={new Date(student.updatedAt).toLocaleDateString()}
// //                 icon="🔄"
// //               />
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="flex gap-4 justify-center pt-4">
// //         <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md">
// //           Edit Profile
// //         </button>
// //         <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
// //           Download Profile
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client"

// import { useState } from "react"

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
//         <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
//           <span className="text-4xl font-bold text-white">{name?.charAt(0)?.toUpperCase() || "?"}</span>
//         </div>
//       )}
//       <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
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
//     ACTIVE: "bg-green-100 text-green-800 border-green-200",
//     PROBATION: "bg-gray-100 text-gray-800 border-gray-200",
//     GRADUATED: "bg-blue-100 text-blue-800 border-blue-200",
//   }

//   return (
//     <div className="flex gap-2">
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status as keyof typeof statusColors] || statusColors.PROBATION}`}
//       >
//         {status}
//       </span>
//       {verified && (
//         <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
//           ✓ Verified
//         </span>
//       )}
//     </div>
//   )
// }

// const mockStudent = {
//   id: "STU001",
//   name: "Sarah Johnson",
//   email: "sarah.johnson@university.edu",
//   phone: "+1 (555) 123-4567",
//   address: "123 Oak Street, New York, NY 10001",
//   image: "/student-avatar.png",
//   isVerified: true,
//   isStaff: false,
//   grade: "A",
//   class: "Year 3",
//   section: "B",
//   currentLevel: "300 Level",
//   gpa: 3.85,
//   totalCredits: 85,
//   academicStatus: "ACTIVE" as const,
//   guardianName: "John Johnson",
//   guardianPhone: "+1 (555) 987-6543",
//   guardianEmail: "john.johnson@email.com",
//   createdAt: "2022-09-15",
//   updatedAt: "2024-01-10",
// }

// export default function MyProfilePage() {
//   const [student, setStudent] = useState(mockStudent)
//   const [isEditingGuardian, setIsEditingGuardian] = useState(false)
//   const [isEditingAcademic, setIsEditingAcademic] = useState(false)
//   const [guardianForm, setGuardianForm] = useState({
//     guardianName: student.guardianName,
//     guardianPhone: student.guardianPhone,
//     guardianEmail: student.guardianEmail,
//   })
//   const [academicForm, setAcademicForm] = useState({
//     grade: student.grade,
//     class: student.class,
//     section: student.section,
//     currentLevel: student.currentLevel,
//     gpa: student.gpa,
//     totalCredits: student.totalCredits,
//   })

//   const handleGuardianChange = (field: string, value: string) => {
//     setGuardianForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleAcademicChange = (field: string, value: string | number) => {
//     setAcademicForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSaveGuardian = () => {
//     setStudent((prev) => ({
//       ...prev,
//       ...guardianForm,
//     }))
//     setIsEditingGuardian(false)
//   }

//   const handleCancelGuardian = () => {
//     setGuardianForm({
//       guardianName: student.guardianName,
//       guardianPhone: student.guardianPhone,
//       guardianEmail: student.guardianEmail,
//     })
//     setIsEditingGuardian(false)
//   }

//   const handleSaveAcademic = () => {
//     setStudent((prev) => ({
//       ...prev,
//       ...academicForm,
//     }))
//     setIsEditingAcademic(false)
//   }

//   const handleCancelAcademic = () => {
//     setAcademicForm({
//       grade: student.grade,
//       class: student.class,
//       section: student.section,
//       currentLevel: student.currentLevel,
//       gpa: student.gpa,
//       totalCredits: student.totalCredits,
//     })
//     setIsEditingAcademic(false)
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="space-y-6 pb-8 max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-3xl font-bold">My Profile</h1>
//             <p className="text-muted-foreground">View and manage your personal information</p>
//           </div>
//         </div>

//         {/* Profile Header Card */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//             <ProfileAvatar image={student.image} name={student.name} />

//             <div className="flex-1 text-center md:text-left space-y-3">
//               <div>
//                 <h2 className="text-3xl font-bold">{student.name}</h2>
//                 <p className="text-blue-100">{student.email}</p>
//               </div>

//               <StatusBadge status={student.academicStatus} verified={student.isVerified} />

//               <div className="flex flex-wrap gap-4 pt-2">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-blue-100">GPA</p>
//                   <p className="text-2xl font-bold">{student.gpa.toFixed(2)}</p>
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-blue-100">Total Credits</p>
//                   <p className="text-2xl font-bold">{student.totalCredits}</p>
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
//                   <p className="text-xs text-blue-100">Grade</p>
//                   <p className="text-2xl font-bold">{student.grade}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Information Grid */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">👤 Personal Information</h3>
//             <div className="space-y-4">
//               <InfoItem label="Full Name" value={student.name} icon="📝" />
//               <InfoItem label="Email Address" value={student.email} icon="📧" />
//               <InfoItem label="Phone Number" value={student.phone} icon="📱" />
//               <InfoItem label="Address" value={student.address} icon="🏠" />
//               <InfoItem label="Account Type" value={student.isStaff ? "Staff Member" : "Student"} icon="🎓" />
//             </div>
//           </div>

//           {/* Academic Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">📚 Academic Information</h3>
//               {!isEditingAcademic && (
//                 <button
//                   onClick={() => setIsEditingAcademic(true)}
//                   className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingAcademic ? (
//               <div className="space-y-4">
//                 <InfoItem label="Grade" value={student.grade} icon="🎯" />
//                 <InfoItem label="Class" value={student.class} icon="🏫" />
//                 <InfoItem label="Section" value={student.section} icon="📑" />
//                 <InfoItem label="Current Level" value={student.currentLevel} icon="📊" />
//                 <InfoItem label="GPA" value={student.gpa.toFixed(2)} icon="⭐" />
//                 <InfoItem label="Total Credits" value={student.totalCredits} icon="🏆" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm text-muted-foreground">Grade</label>
//                   <input
//                     type="text"
//                     value={academicForm.grade}
//                     onChange={(e) => handleAcademicChange("grade", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Class</label>
//                   <input
//                     type="text"
//                     value={academicForm.class}
//                     onChange={(e) => handleAcademicChange("class", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Section</label>
//                   <input
//                     type="text"
//                     value={academicForm.section}
//                     onChange={(e) => handleAcademicChange("section", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Current Level</label>
//                   <input
//                     type="text"
//                     value={academicForm.currentLevel}
//                     onChange={(e) => handleAcademicChange("currentLevel", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">GPA</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={academicForm.gpa}
//                     onChange={(e) => handleAcademicChange("gpa", Number.parseFloat(e.target.value))}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Total Credits</label>
//                   <input
//                     type="number"
//                     value={academicForm.totalCredits}
//                     onChange={(e) => handleAcademicChange("totalCredits", Number.parseInt(e.target.value))}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     onClick={handleSaveAcademic}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelAcademic}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Guardian Information */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">👨‍👩‍👧 Guardian Information</h3>
//               {!isEditingGuardian && (
//                 <button
//                   onClick={() => setIsEditingGuardian(true)}
//                   className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingGuardian ? (
//               <div className="space-y-4">
//                 <InfoItem label="Guardian Name" value={student.guardianName} icon="👤" />
//                 <InfoItem label="Guardian Phone" value={student.guardianPhone} icon="📱" />
//                 <InfoItem label="Guardian Email" value={student.guardianEmail} icon="📧" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm text-muted-foreground">Guardian Name</label>
//                   <input
//                     type="text"
//                     value={guardianForm.guardianName}
//                     onChange={(e) => handleGuardianChange("guardianName", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Guardian Phone</label>
//                   <input
//                     type="tel"
//                     value={guardianForm.guardianPhone}
//                     onChange={(e) => handleGuardianChange("guardianPhone", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm text-muted-foreground">Guardian Email</label>
//                   <input
//                     type="email"
//                     value={guardianForm.guardianEmail}
//                     onChange={(e) => handleGuardianChange("guardianEmail", e.target.value)}
//                     className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     onClick={handleSaveGuardian}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelGuardian}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Account Status */}
//           <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
//             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">⚙️ Account Status</h3>
//             <div className="space-y-4">
//               <InfoItem label="Academic Status" value={student.academicStatus} icon="📋" />
//               <InfoItem
//                 label="Verification Status"
//                 value={student.isVerified ? "Verified ✓" : "Not Verified"}
//                 icon="✅"
//               />
//               {student.createdAt && (
//                 <InfoItem label="Member Since" value={new Date(student.createdAt).toLocaleDateString()} icon="📅" />
//               )}
//               {student.updatedAt && (
//                 <InfoItem label="Last Updated" value={new Date(student.updatedAt).toLocaleDateString()} icon="🔄" />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 justify-center pt-4">
//           <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md">
//             Edit Profile
//           </button>
//           <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//             Download Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

