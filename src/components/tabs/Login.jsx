import React from 'react'

function Login({login}) {
  return (
    <div className='w-full'>
      <header className="flex justify-center items-center h-32">
				<div className="text-4xl font-bold">Login</div>
			</header>
      <div className='mx-4'>
        <div className='w-full p-2 rounded border-slate-900 border mb-4 text-xl' onClick={() => {login()}}>Login</div>
      </div>
    </div>
  )
}

export default Login