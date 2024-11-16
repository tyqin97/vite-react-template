import { useState, useEffect } from "react";

export default function PreprocessingDialog({ 
    setPredetails, 
    setIsPDetails }) {

  const [pdetail, setPdetail] = useState(JSON.parse(localStorage.getItem("pdetail")));

  useEffect(() => {
    async function parseZscoreParam () {
        setPredetails((prev) => {
            return {
                ...prev,
                zscoreParam: JSON.parse(pdetail.zscoreParam)
            }
        })
    }

    try {
        parseZscoreParam()
    }
    finally {

    }

  }, [])

  async function handleCloseClick () {
    setIsPDetails(prev => !prev)
  }

  async function toggleCheckbox () {

  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Preprocessing Menu</h2>
        <form>
          <div className="side-by-side">
            <p>Standardization</p>
            <button
              disabled={pdetail}
            >Standardize</button>
            <button>De-Standardize</button>
          </div>
          
          <button
            onClick={handleCloseClick}
          >Close</button>
        </form>
      </div>
    </div>
  );
}
