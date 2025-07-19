import React from 'react'

const Header = ({ title, description }) => {
    return (
        <header className='w-full'>
            <div className="w-full flex-between py-3">
                <div>
                    <h2 className="capitalize font-semibold font-karla text-lg lg:font-bold text-dark-200">
                        {title}
                    </h2>
                    <p className="text-ligh-200 text-xs font-recursive">
                        {description}
                    </p>
                </div>
            </div>
        </header>
    )
}

export default Header