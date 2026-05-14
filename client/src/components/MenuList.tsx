import type { MenuItem } from '/Users/samuel/Desktop/AFI-project/shared/types.ts'
import './MenuList.css'

interface Props {
  items: MenuItem[]
  onAdd: (item: MenuItem) => void
}

export default function MenuList({ items, onAdd }: Props) {
  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="menu-list">
      {categories.map(category => (
        <div key={category} className="menu-category">
          <h2 className="category-title">{category}</h2>
          <div className="category-items">
            {items
              .filter(i => i.category === category && i.isAvailable)
              .map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    <span className="price">{item.price} kr</span>
                  </div>
                  <button className="add-btn" onClick={() => onAdd(item)}>+</button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}