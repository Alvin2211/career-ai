import React from 'react'
import Navbar from '@/components/Navbar.jsx'
import GenCourses from '@/components/genCourses'

const Courses = () => {
  return (
    <div className='bg-black min-h-screen'>
      <Navbar />
      <GenCourses />
    </div>
  )
}

export default Courses
