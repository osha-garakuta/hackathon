"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

interface CalculationResult {
  ingredient_id: string
  name: string
  amount: number
}

interface NutritionInfo {
  calories: number
  protein: number
  vitamins: string[]
  minerals: string[]
}

const ingredientData = {
  carrot: { name: "にんじん", baseAmount: 30 },
  daikon: { name: "大根", baseAmount: 40 },
  komatsuna: { name: "小松菜", baseAmount: 25 },
  cabbage: { name: "キャベツ", baseAmount: 35 },
  konjac: { name: "こんにゃく", baseAmount: 20 },
  wakame: { name: "わかめ", baseAmount: 5 },
  zucchini: { name: "ズッキーニ", baseAmount: 30 },
  beetroot: { name: "ビートルート", baseAmount: 25 },
  kale: { name: "ケール", baseAmount: 20 },
  broccoli: { name: "ブロッコリー", baseAmount: 30 },
  asparagus: { name: "アスパラガス", baseAmount: 25 },
}

export default function CalculationPage() {
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [calculations, setCalculations] = useState<CalculationResult[]>([])
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const ageParam = searchParams.get("age")
    const genderParam = searchParams.get("gender")
    const ingredientsParam = searchParams.get("ingredients")

    if (ageParam) setAge(ageParam)
    if (genderParam) setGender(genderParam)
    if (ingredientsParam) {
      const ingredients = ingredientsParam.split(",")
      setSelectedIngredients(ingredients)

      // Pythonバックエンドに計算を依頼
      calculateNutrition(ageParam || "", genderParam || "", ingredients)
    }
  }, [searchParams])

  const calculateNutrition = async (age: string, gender: string, ingredients: string[]) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/calculate-nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age,
          gender,
          ingredients,
        }),
      })

      if (!response.ok) {
        throw new Error("計算に失敗しました")
      }

      const data = await response.json()
      setCalculations(data.calculations)
      setNutritionInfo(data.nutrition_info)
    } catch (err) {
      setError("計算中にエラーが発生しました。しばらくしてからもう一度お試しください。")
      console.error("Calculation error:", err)

      // エラー時のフォールバック表示用のダミーデータ
      const dummyCalculations = ingredients.map((ingredient) => ({
        ingredient_id: ingredient,
        name: getIngredientName(ingredient),
        amount: 30, // ダミー値
      }))
      setCalculations(dummyCalculations)
    } finally {
      setLoading(false)
    }
  }

  const getIngredientName = (id: string): string => {
    const ingredientNames: { [key: string]: string } = {
      carrot: "にんじん",
      daikon: "大根",
      komatsuna: "小松菜",
      cabbage: "キャベツ",
      konjac: "こんにゃく",
      wakame: "わかめ",
      zucchini: "ズッキーニ",
      beetroot: "ビートルート",
      kale: "ケール",
      broccoli: "ブロッコリー",
      asparagus: "アスパラガス",
    }
    return ingredientNames[id] || id
  }

  const handleStartOver = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="washi-background">
        <div className="container py-8 relative z-10">
          <div className="text-center">
            <div className="card">
              <h2 className="title-main">計算中...</h2>
              <p className="text-description">栄養バランスを計算しています。しばらくお待ちください。</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="washi-background">
      <div className="container py-8 relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Image
              src="/logo.png"
              alt="味噌汁の匠ロゴ"
              width={140}
              height={140}
              className="object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="title-main mb-4">あなた専用の味噌汁レシピ</h1>
          <div className="card-thin-border">
            <p className="text-bold">
              {age}・{gender}の方に最適な分量です
            </p>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="card mb-10" style={{ borderColor: "#dc2626", backgroundColor: "rgba(254, 226, 226, 0.95)" }}>
            <p style={{ color: "#dc2626", textAlign: "center", fontSize: "1.125rem", fontWeight: "600" }}>{error}</p>
          </div>
        )}

        {/* 分量表示 */}
        <div className="card mb-10">
          <div className="header-section">
            <h2 className="header-title">推奨分量（1人前）</h2>
          </div>
          <div style={{ padding: "2rem" }}>
            <div className="grid-amounts">
              {calculations.map((calculation) => (
                <div key={calculation.ingredient_id} className="amount-card">
                  <span className="amount-name">{calculation.name}</span>
                  <span className="amount-value">{calculation.amount}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 栄養バランス情報 */}
        <div className="card mb-10">
          <div className="header-section">
            <h2 className="title-large" style={{ color: "white" }}>
              栄養バランスのポイント
            </h2>
          </div>
          <div className="nutrition-info">
            <ul className="nutrition-list space-y-4">
              <li className="nutrition-item">{age}の方に適したカロリー量に調整しています</li>
              <li className="nutrition-item">{gender}の方の栄養需要を考慮した分量です</li>
              <li className="nutrition-item">選択された具材で、ビタミン・ミネラルのバランスを最適化しています</li>
              <li className="nutrition-item">味噌汁1杯で、1日に必要な野菜の一部を摂取できます</li>
              {nutritionInfo && (
                <>
                  <li className="nutrition-item">推定カロリー: {nutritionInfo.calories}kcal</li>
                  <li className="nutrition-item">タンパク質: {nutritionInfo.protein}g</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="text-center">
          <button onClick={handleStartOver} className="btn-primary">
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  )
}
