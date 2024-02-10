import { App as AppProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@contexts'

import App from './App'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AppProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</AppProvider>
	</React.StrictMode>,
)
