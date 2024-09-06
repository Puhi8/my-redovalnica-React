import React from "react"; React
import{Outlet, Link} from "react-router-dom"

export default function Navbar(props){
   let isMobile = props.isMobile
   let device = isMobile ? "mobile" : "computer"

   return(
      <>
         <nav className={`navbar ${device}`}>
            <Link to={"/"} className={`navbar-link-home navbarPosition-left ${device}`}>
               <img src="../src/img/home.png" alt="home" className={`navbar-img-home ${device}`} />
            </Link>
            <Link to={"/grades"} className={`navbar-link navbarPosition-left ${device}`}>
               <img src="../src/img/grades.png" alt="grades" className={`navbar-img ${device}`} />
               {!isMobile && <h2 className={`navbar-h2 ${device}`}>Grades</h2>}
            </Link>
            <Link to={"/finalGrades"} className={`navbar-link navbarPosition-left ${device}`}>
               <img src="../src/img/finalGrade.png" alt="finale grades" className={`navbar-img ${device}`} />
               {!isMobile && <h2 className={`navbar-h2 ${device}`}>Final</h2>}
            </Link>
            <Link to={"/dates"} className={`navbar-link navbarPosition-left ${device}`}>
               <img src="../src/img/dates.png" alt="future dates" className={`navbar-img ${device}`} />
               {!isMobile && <h2 className={`navbar-h2 ${device}`}>Dates</h2>}
            </Link>
            <Link to={"/teachers"} className={`navbar-link navbarPosition-left ${device}`}>
               <img src="../src/img/teacher.png" alt="teachers" className={`navbar-img ${device}`} />
               {!isMobile && <h2 className={`navbar-h2 ${device}`}>Teachers</h2>}
            </Link>
            <Link to={"/settings"} className={`navbar-link navbarPosition-right ${device}`}>
               <img src="../src/img/settings.png" alt="settings" className={`navbar-img ${device}`} />
               {!isMobile && <h2 className={`navbar-h2 ${device}`}>Settings</h2>}
            </Link>
         </nav>
         <main>
            <Outlet/>
         </main>
      </>
   )
}