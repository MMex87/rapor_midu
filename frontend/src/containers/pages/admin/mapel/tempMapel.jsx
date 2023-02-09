import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const TempMapel = () => {
    const navigate = useNavigate()


    // Hooks Use Effect
    useEffect(() => {
        navigate('/mapel')
    }, [])

    return (
        <div>TempKelas</div>
    )
}
