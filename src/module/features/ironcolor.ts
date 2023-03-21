import { IronswornSettings } from '../helpers/settings'

import '../../styles/styles.less'
import '../../styles/_irontheme.scss'
import '../../styles/_ironcolor/zinc.scss'
import '../../styles/_ironcolor/phosphor.scss'

export function colorSchemeSetup() {
	$(document.body).addClass(IronswornSettings.classes.join(' '))

	if (IronswornSettings.get('color-scheme') === 'phosphor') {
		// TODO: figure out a way to automate this without calling it out for every single color scheme.
		;(<string[]>CONFIG.TinyMCE.content_css)?.push(
			'/systems/foundry-ironsworn/styles/starforged-tinymce.css'
		)
	}
}

/**
 * Instantly updates the client's color scheme without reloading.
 */
export function updateColorScheme(
	newColorScheme: ClientSettings.Values['foundry-ironsworn.color-scheme']
) {
	const colorSchemes = Object.keys(
		game.settings.settings.get('foundry-ironsworn.color-scheme')
			?.choices as unknown as Record<string, unknown>
	)
	const classesToRemove = colorSchemes.map((str) => `ironcolor__${str}`)
	$(document.body)
		.removeClass(classesToRemove.join(' '))
		.addClass(`ironcolor__${newColorScheme}`)
}
