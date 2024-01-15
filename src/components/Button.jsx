/* eslint-disable react/prop-types */
const Button = ({ onClick, icon, children }) => {

  return (
    <div className="grid mx-6 mt-5 relative">
      {icon &&
        <div className="absolute flex left-6 items-center h-full" >
          <img src={icon} className="w-7" />
        </div>
      }
      <button
        className='h-14 rounded-3xl border-none'
        onClick={() => onClick()}
      >
        {children}
      </button>
    </div>
  )
}

export default Button