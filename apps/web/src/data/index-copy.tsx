// import { createFileRoute } from "@tanstack/react-router";
// import { Menu, X } from "lucide-react";
// import { AnimatePresence, motion } from "motion/react";
// import { useState } from "react";
// import AdminDashboardDefault from "@/adminComponents/AdminDashboardDefault";
// import QuestionBank from "@/adminComponents/QuestionBank";
// import TeacherDashboardDefault from "@/adminComponents/TeacherDashboardDefault";
// import DeleteQuestionDialog from "@/components/admin/DeleteQuestionDialog";
// import PageTransition from "@/components/admin/PageTransition";
// import AddQuestionPage from "@/components/admin/pages/AddQuestionPage";
// import BlueBookAddNewQuestionPage from "@/components/admin/pages/BlueBookAddNewQuestionPage";
// import BlueBookEditQuestionPage from "@/components/admin/pages/BlueBookEditQuestionPage";
// import BlueBookPage from "@/components/admin/pages/BlueBookPage";
// import CourseAddNewCoursePage from "@/components/admin/pages/CourseAddNewCoursePage";
// import CourseEditCoursePage from "@/components/admin/pages/CourseEditCoursePage";
// import CoursePage from "@/components/admin/pages/CoursePage";
// import CourseViewPage from "@/components/admin/pages/CourseViewPage";
// import EditQuestionPage from "@/components/admin/pages/EditQuestionPage";
// import LiveCoursePage from "@/components/admin/pages/LiveCoursePage";
// import ViewQuestionModal from "@/components/admin/ViewQuestionModal";
// export const Route = createFileRoute("/admin/index-copy")({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const [currentPage, setCurrentPage] = useState<
// 		| "admin"
// 		| "teacher"
// 		| "questionbank"
// 		| "addquestion"
// 		| "editquestion"
// 		| "bluebook"
// 		| "bluebookaddquestion"
// 		| "bluebookeditquestion"
// 		| "course"
// 		| "courseaddnewcourse"
// 		| "courseview"
// 		| "courseedit"
// 		| "livecourse"
// 	>("admin");
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// 	const [isViewQuestionOpen, setIsViewQuestionOpen] = useState(false);
// 	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

// 	const handleNavigate = (page: string) => {
// 		if (
// 			page === "admin" ||
// 			page === "teacher" ||
// 			page === "questionbank" ||
// 			page === "addquestion" ||
// 			page === "editquestion" ||
// 			page === "bluebook" ||
// 			page === "bluebookaddquestion" ||
// 			page === "bluebookeditquestion" ||
// 			page === "course" ||
// 			page === "courseaddnewcourse" ||
// 			page === "courseview" ||
// 			page === "courseedit" ||
// 			page === "livecourse"
// 		) {
// 			setCurrentPage(page);
// 			setIsSidebarOpen(false);
// 		}
// 	}

// 	const handleViewQuestion = () => {
// 		setIsViewQuestionOpen(true);
// 	}

// 	const handleCloseViewQuestion = () => {
// 		setIsViewQuestionOpen(false);
// 	}

// 	const handleAddNewQuestion = () => {
// 		setCurrentPage("addquestion");
// 	}

// 	const handleEditQuestion = () => {
// 		setCurrentPage("editquestion");
// 	}

// 	const handleDeleteQuestion = () => {
// 		setIsDeleteDialogOpen(true);
// 	}

// 	const handleConfirmDelete = () => {
// 		console.log("Question deleted from Question Bank");
// 		// Handle actual deletion logic here
// 	}
// 	return (
// 		<div className="w-full min-h-screen overflow-x-hidden bg-white relative">
// 			{/* Mobile Menu Toggle Button with Animation */}
// 			<motion.button
// 				initial={{ opacity: 0, scale: 0.8 }}
// 				animate={{ opacity: 1, scale: 1 }}
// 				whileHover={{ scale: 1.05 }}
// 				whileTap={{ scale: 0.95 }}
// 				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// 				className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#585858] rounded-md shadow-lg hover:bg-[#6a6a6a] transition-colors"
// 				aria-label="Toggle menu"
// 			>
// 				<AnimatePresence mode="wait">
// 					{isSidebarOpen ? (
// 						<motion.div
// 							key="close"
// 							initial={{ rotate: -90, opacity: 0 }}
// 							animate={{ rotate: 0, opacity: 1 }}
// 							exit={{ rotate: 90, opacity: 0 }}
// 							transition={{ duration: 0.2 }}
// 						>
// 							<X className="w-6 h-6 text-white" />
// 						</motion.div>
// 					) : (
// 						<motion.div
// 							key="menu"
// 							initial={{ rotate: 90, opacity: 0 }}
// 							animate={{ rotate: 0, opacity: 1 }}
// 							exit={{ rotate: -90, opacity: 0 }}
// 							transition={{ duration: 0.2 }}
// 						>
// 							<Menu className="w-6 h-6 text-white" />
// 						</motion.div>
// 					)}
// 				</AnimatePresence>
// 			</motion.button>

// 			{/* Overlay for mobile with animation */}
// 			<AnimatePresence>
// 				{isSidebarOpen && (
// 					<motion.div
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: 1 }}
// 						exit={{ opacity: 0 }}
// 						transition={{ duration: 0.2 }}
// 						className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
// 						onClick={() => setIsSidebarOpen(false)}
// 					/>
// 				)}
// 			</AnimatePresence>

// 			{/* View Question Modal with Animation */}
// 			<ViewQuestionModal
// 				isOpen={isViewQuestionOpen}
// 				onClose={handleCloseViewQuestion}
// 			/>

// 			{/* Delete Question Dialog */}
// 			<DeleteQuestionDialog
// 				isOpen={isDeleteDialogOpen}
// 				onClose={() => setIsDeleteDialogOpen(false)}
// 				onConfirm={handleConfirmDelete}
// 				questionId="f1bfbed3"
// 			/>

// 			{/* Responsive CSS for all pages */}
// 			<style>{`
//         /* Base container adjustments */
//         [data-name="Admin dashboard --- Default"],
//         [data-name="Teacher Dashboard --- Default"],
//         [data-name="Question bank"],
//         [data-name="Question Bank --- Add new question"],
//         [data-name="Question Bank --- Edit question"],
//         [data-name="Course"],
//         [data-name="Course --- Add new course"],
//         [data-name="Course --- Course list --- view"],
//         [data-name="Course --- Edit course"],
//         [data-name="Course --- Live course"] {
//           min-height: 100vh;
//           overflow-x: hidden;
//         }

//         /* Sidebar responsive behavior */
//         @media (max-width: 1023px) {
//           [data-name="Left sidebar"] {
//             position: fixed !important;
//             z-index: 50;
//             height: 100vh !important;
//             top: 0 !important;
//             left: 0 !important;
//             width: 270px !important;
//             transform: translateX(${isSidebarOpen ? "0" : "-100%"});
//             transition: transform 0.3s ease-in-out;
//           }

//           [data-name="Left sidebar"] > div:first-child {
//             bottom: 0 !important;
//             height: 100% !important;
//           }
//         }

//         @media (min-width: 1024px) {
//           [data-name="Left sidebar"] {
//             position: absolute !important;
//             transform: translateX(0) !important;
//           }
//         }

//         /* Top Nav responsive adjustments */
//         @media (max-width: 1023px) {
//           [data-name="Top nav"] {
//             position: relative !important;
//             width: 100% !important;
//             left: 0 !important;
//             padding-left: 60px;
//           }

//           [data-name="Top nav"] > div:first-child {
//             width: 100% !important;
//             left: 0 !important;
//           }

//           [data-name="User icon"] {
//             left: auto !important;
//             right: 20px !important;
//           }
//         }

//         /* Main content area adjustments */
//         @media (max-width: 1023px) {
//           /* Admin Dashboard Groups */
//           [data-name="Group 38"],
//           [data-name="Group 37"],
//           [data-name="Group 36"] {
//             position: relative !important;
//             left: 0 !important;
//             top: auto !important;
//             width: 100% !important;
//             padding: 1rem;
//             margin-top: 1rem;
//           }

//           [data-name="Group 38"] {
//             margin-top: 100px !important;
//           }

//           /* Teacher Dashboard specific */
//           [data-name="Group 41"],
//           [data-name="Group 40"],
//           [data-name="Group 39"] {
//             position: relative !important;
//             left: 0 !important;
//             top: auto !important;
//             width: 100% !important;
//             padding: 1rem;
//             margin-top: 1rem;
//           }

//           [data-name="Group 41"] {
//             margin-top: 100px !important;
//           }

//           /* Question Bank specific */
//           [data-name="input field"] {
//             position: relative !important;
//             left: 0 !important;
//             width: calc(100% - 2rem) !important;
//             margin: 1rem auto;
//           }

//           [data-name="Button"] {
//             position: relative !important;
//             left: 1rem !important;
//             margin-top: 1rem;
//           }

//           [data-name="Table section"] {
//             position: relative !important;
//             left: 0 !important;
//             width: calc(100% - 2rem) !important;
//             margin: 2rem auto;
//             overflow-x: auto;
//           }

//           /* Add/Edit Question Pages - mobile adjustments */
//           .max-w-\\[1400px\\] {
//             padding-left: 1rem !important;
//             padding-right: 1rem !important;
//           }
//         }

//         /* Tablet adjustments (768px - 1023px) */
//         @media (min-width: 768px) and (max-width: 1023px) {
//           [data-name="Group 38"],
//           [data-name="Group 37"],
//           [data-name="Group 36"],
//           [data-name="Group 41"],
//           [data-name="Group 40"],
//           [data-name="Group 39"] {
//             padding: 1.5rem;
//           }

//           [data-name="Table section"] {
//             width: calc(100% - 3rem) !important;
//             margin: 2rem 1.5rem;
//           }
//         }

//         /* Mobile specific (< 768px) */
//         @media (max-width: 767px) {
//           [data-name="Table section"] table {
//             display: block;
//             overflow-x: auto;
//             white-space: nowrap;
//           }

//           [data-name="Group 38"] > div,
//           [data-name="Group 37"] > div,
//           [data-name="Group 36"] > div,
//           [data-name="Group 41"] > div,
//           [data-name="Group 40"] > div,
//           [data-name="Group 39"] > div {
//             position: relative !important;
//             width: 100% !important;
//             left: 0 !important;
//             margin-bottom: 1rem;
//           }
//         }

//         /* Ensure proper scrolling */
//         html, body {
//           overflow-x: hidden;
//         }

//         #root {
//           overflow-x: hidden;
//         }

//         /* View Question Modal Responsive */
//         @media (max-width: 1023px) {
//           [data-name="Question Bank --- View question"] {
//             min-height: auto !important;
//           }

//           [data-name="Question Bank --- View question"] [data-name="Heading"] > div:first-child {
//             width: 100% !important;
//             left: 0 !important;
//           }

//           [data-name="Question Bank --- View question"] [data-name="bottom bar"] > div:first-child {
//             width: 100% !important;
//             left: 0 !important;
//           }

//           [data-name="question section"],
//           [data-name="Answer and explanation"] {
//             position: relative !important;
//             left: 1rem !important;
//             width: calc(100% - 2rem) !important;
//             margin-bottom: 2rem;
//           }

//           [data-name="Label"] {
//             position: relative !important;
//             left: 1rem !important;
//             margin-top: 2rem;
//           }

//           [data-name="image"] {
//             position: relative !important;
//             left: 1rem !important;
//             margin-top: 2rem;
//           }
//         }

//         /* Smooth transitions for all interactive elements */
//         button, a, [role="button"] {
//           transition: all 0.2s ease-in-out;
//         }
//       `}</style>

// 			{/* Main Dashboard Content with Page Transitions */}
// 			<div className="w-full min-h-screen">
// 				<AnimatePresence mode="wait">
// 					{currentPage === "admin" ? (
// 						<PageTransition key="admin" pageKey="admin">
// 							<AdminDashboardDefault onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "teacher" ? (
// 						<PageTransition key="teacher" pageKey="teacher">
// 							<TeacherDashboardDefault onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "questionbank" ? (
// 						<PageTransition key="questionbank" pageKey="questionbank">
// 							<QuestionBank
// 								onNavigate={handleNavigate}
// 								onViewQuestion={handleViewQuestion}
// 								onAddNew={handleAddNewQuestion}
// 								onEdit={handleEditQuestion}
// 								onDelete={handleDeleteQuestion}
// 							/>
// 						</PageTransition>
// 					) : currentPage === "addquestion" ? (
// 						<PageTransition key="addquestion" pageKey="addquestion">
// 							<AddQuestionPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "editquestion" ? (
// 						<PageTransition key="editquestion" pageKey="editquestion">
// 							<EditQuestionPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "bluebook" ? (
// 						<PageTransition key="bluebook" pageKey="bluebook">
// 							<BlueBookPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "bluebookaddquestion" ? (
// 						<PageTransition
// 							key="bluebookaddquestion"
// 							pageKey="bluebookaddquestion"
// 						>
// 							<BlueBookAddNewQuestionPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "bluebookeditquestion" ? (
// 						<PageTransition
// 							key="bluebookeditquestion"
// 							pageKey="bluebookeditquestion"
// 						>
// 							<BlueBookEditQuestionPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "course" ? (
// 						<PageTransition key="course" pageKey="course">
// 							<CoursePage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "courseaddnewcourse" ? (
// 						<PageTransition
// 							key="courseaddnewcourse"
// 							pageKey="courseaddnewcourse"
// 						>
// 							<CourseAddNewCoursePage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "courseview" ? (
// 						<PageTransition key="courseview" pageKey="courseview">
// 							<CourseViewPage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "courseedit" ? (
// 						<PageTransition key="courseedit" pageKey="courseedit">
// 							<CourseEditCoursePage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : currentPage === "livecourse" ? (
// 						<PageTransition key="livecourse" pageKey="livecourse">
// 							<LiveCoursePage onNavigate={handleNavigate} />
// 						</PageTransition>
// 					) : null}
// 				</AnimatePresence>
// 			</div>
// 		</div>
// 	)
// }
