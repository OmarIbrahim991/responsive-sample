import { useEffect, useLayoutEffect, useState } from 'react'
import { get } from './utils/api'

const useWindowWidth = () => {
	const [width, setWidth] = useState(null)

	useLayoutEffect(() => {
		const updateWidth = () => {
			setWidth(window.innerWidth)
		}
		window.addEventListener('resize', updateWidth)
		updateWidth()
		return () => window.removeEventListener('resize', updateWidth)
	}, [])
	return width <= 600 ? "list" : "table"
}

const App = () => {
	const view = useWindowWidth()
	const [products, setProducts] = useState([])

	const loadProduct = (id) => {
		get({ id }).then(product => setProducts(current => current.map(p => p.id === product.id ? product : p)))
	}

	useEffect(() => {
		get({ view }).then(data => setProducts(data))
	}, [view])

	if (!view || products.length === 0) return <h1>Loading...</h1>

	if (view === "list") {
		return (
			<main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
				{products.map(({ id, title, description, price, category, image }) => (
					<details key={id} onClick={() => loadProduct(id)}>
						<summary>{id}</summary>
						{
							title ?
								<ul>
									<li>{title}</li>
									<li>{price}</li>
									<li>{description}</li>
									<li>{category}</li>
									<li>{image}</li>
								</ul>
							:
								<p>Loading...</p>
						}
					</details>
			))}
			</main>
		)
	}

	return (
		<table>
			<thead>
				<tr>
					{Object.keys(products[0]).map(header => <td key={header}>{header}</td>)}
				</tr>
			</thead>
			<tbody>
				{
					products.map(({ id, title, price, description, category, image }) => (
						<tr key={id}>
							<td>{id}</td>
							<td>{title}</td>
							<td>{price}</td>
							<td>{description}</td>
							<td>{category}</td>
							<td>{image}</td>
						</tr>
					))
				}
			</tbody>
	</table>
	)
}

export default App
