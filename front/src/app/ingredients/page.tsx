"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

const ingredients = [
  { id: "carrot", name: "にんじん", image: "/placeholder.svg?height=150&width=150" },
  { id: "daikon", name: "大根", image: "/placeholder.svg?height=150&width=150" },
  { id: "komatsuna", name: "小松菜", image: "/placeholder.svg?height=150&width=150" },
  { id: "cabbage", name: "キャベツ", image: "/placeholder.svg?height=150&width=150" },
  { id: "konjac", name: "こんにゃく", image: "/placeholder.svg?height=150&width=150" },
  { id: "wakame", name: "わかめ", image: "/placeholder.svg?height=150&width=150" },
  { id: "zucchini", name: "ズッキーニ", image: "/placeholder.svg?height=150&width=150" },
  { id: "beetroot", name: "ビートルート", image: "/placeholder.svg?height=150&width=150" },
  { id: "kale", name: "ケール", image: "/placeholder.svg?height=150&width=150" },
  { id: "broccoli", name: "ブロッコリー", image: "/placeholder.svg?height=150&width=150" },
  { id: "asparagus", name: "アスパラガス", image: "/placeholder.svg?height=150&width=150" },
]

export default function IngredientsPage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ageParam = searchParams.get("age")
    const genderParam = searchParams.get("gender")
    if (ageParam) setAge(ageParam)
    if (genderParam) setGender(genderParam)
  }, [searchParams])

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId) ? prev.filter((id) => id !== ingredientId) : [...prev, ingredientId],
    )
  }

  const handleNext = () => {
    if (selectedIngredients.length > 0) {
      const params = new URLSearchParams({
        age,
        gender,
        ingredients: selectedIngredients.join(","),
      })
      router.push(`/calculation?${params.toString()}`)
    }
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
          <h1 className="title-main mb-4">お好みの具材を選んでください</h1>
          <div className="card-thin-border">
            <p className="text-bold">
              {age}・{gender}の方向けの栄養バランスを考慮いたします
            </p>
          </div>
        </div>

        {/* 具材選択 */}
        <div className="grid-ingredients mb-10">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={`ingredient-card ${selectedIngredients.includes(ingredient.id) ? "selected" : ""}`}
              onClick={() => handleIngredientToggle(ingredient.id)}
            >
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Image
                  src={ingredient.image || "/placeholder.svg"}
                  alt={ingredient.name}
                  width={120}
                  height={120}
                  className="ingredient-image"
                />
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleIngredientToggle(ingredient.id)}
                    className="checkbox"
                  />
                </div>
              </div>
              <h3 className="ingredient-name">{ingredient.name}</h3>
            </div>
          ))}
        </div>

        {/* 選択状況と次へボタン */}
        <div className="text-center space-y-6">
          <div className="card-thin-border">
            <p className="title-large">
              選択した具材: <span style={{ fontSize: "1.875rem", color: "#b45309" }}>{selectedIngredients.length}</span>
              種類
            </p>
          </div>

          <button onClick={handleNext} disabled={selectedIngredients.length === 0} className="btn-primary">
            分量を計算する
          </button>
        </div>
      </div>
    </div>
  )
}
