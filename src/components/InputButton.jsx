import { useState } from "react"

/* eslint-disable react/prop-types */
const InputButton = ({ icon, buttonIcon, placeholder, setInput, type }) => {
  const [typeInput, setTypeInput] = useState(type ? type : "text")
  const [buttonStatus, setButtonStatus] = useState(true)

  const setType = () => {
    if (buttonStatus) {
      setButtonStatus(false)
      setTypeInput('text')
    } else {
      setButtonStatus(true)
      setTypeInput(type)
    }
  }
  return (
    <div className={`grid mx-6 mt-5 relative`}>
      <div className="absolute flex left-6 items-center h-full">
        <img src={icon} className="w-5" />
      </div>

      <input
        type={typeInput}
        className="border rounded-lg h-12 pl-16 bg-white text-black"
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
      />
      {buttonIcon &&
        <button onClick={setType} className="bg-transparent border-none absolute flex right-6 items-center h-full">
          <img src={buttonIcon} className="w-5 " />
        </button>
      }
    </div>
  )
}

export default InputButton