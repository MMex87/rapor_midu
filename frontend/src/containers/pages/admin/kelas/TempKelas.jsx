import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const TempKelas = () => {
    const navigate = useNavigate()


    // Hooks Use Effect
    useEffect(() => {
        navigate('/kelas')
    }, [])

    return (
        <div>TempKelas</div>
    )
}
