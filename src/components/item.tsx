/**
 * item.tsx (RandomActivity)
 * 외부 API(동물 랜덤)를 호출해 활동/카테고리를 보여주는 클라이언트 컴포넌트입니다.
 * "불러오기" 버튼 클릭 시 API 호출 후 결과를 화면에 표시합니다.
 */

'use client'

import React, { useState } from 'react'
import './item.css'

/** 랜덤 활동 컴포넌트 */
const RandomActivity: React.FC = () => {
    const [activity, setActivity] = useState<string>('')
    const [type, setType] = useState<string>('')

    /**
     * 외부 API 호출 후 activity, type 상태 업데이트
     * 실패 시 "API 호출 실패 😢" 메시지 표시
     */
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

export default RandomActivity
