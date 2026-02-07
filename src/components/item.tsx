'use client'

import React, { useState } from 'react'
import './item.css'

const RandomActivity: React.FC = () => {
    const [activity, setActivity] = useState<string>('')
    const [type, setType] = useState<string>('')

    const fetchActivity = async () => {
        try {
            const res = await fetch('https://zoo-animal-api.herokuapp.com/animals/rand')
            const data = await res.json()
            setActivity(data.activity)
            setType(data.type)
        } catch (err) {
            console.error('API 호출 실패', err)
            setActivity('API 호출 실패 😢')
            setType('')
        }
    }

    return (
        <div className="item">
            <h1 className="item__title">🎲 랜덤 활동/아이템</h1>
            <button type="button" className="item__button" onClick={fetchActivity}>
                불러오기
            </button>
            {activity && (
                <div className="item__result">
                    <p>활동: {activity}</p>
                    <p>카테고리: {type}</p>
                </div>
            )}
        </div>
    )
}

export default RandomActivity;
