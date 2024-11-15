import { useState, useEffect } from "react"

export default function PreprocessingDialog ({ setPredetails }) {
  useEffect(() => {
    setPredetails(prev => {
        return {
            ...prev,
            a: true
        }
    })
  }, [])


  return (
    <div className="modal">
        <div className="model-content">
            <h1>PreprocessingDialog</h1>
        </div>
    </div>
  )
}