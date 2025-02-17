<template>
	<div
		class="block"
		:class="{ [$style.box]: true, ...classes }"
		:data-tooltip="$t('IRONSWORN.Roll +x', { stat: $t(i18nKey) })"
		@click="click">
		<label :class="$style.label">{{ $t(i18nKey) }}</label>
		<div class="flexrow">
			<div v-if="editMode" class="clickable text" @click="decrement">
				&minus;
			</div>
			<span :class="$style.value">{{ actorSys[attr] }}</span>
			<div v-if="editMode" class="clickable text" @click="increment">
				&plus;
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject, computed, capitalize } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import type { CharacterDataPropertiesData } from '../../actor/actortypes'
import { IronswornPrerollDialog } from '../../rolls'
import { $ActorKey, ActorKey } from '../provisions'

const props = defineProps<{ attr: string }>()
const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref<
	ReturnType<typeof IronswornActor.prototype.toObject>
>
const actorSys = computed(
	() => (actor.value as any)?.system as CharacterDataPropertiesData
)

const classes = computed(() => ({
	clickable: !editMode.value,
	'isiconbg-d10-tilt': !editMode.value
}))
const i18nKey = computed(() => `IRONSWORN.${capitalize(props.attr)}`)
const editMode = computed(
	() => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

function click() {
	if (editMode.value) return

	let attrName = game.i18n.localize('IRONSWORN.' + capitalize(props.attr))
	if (attrName.startsWith('IRONSWORN.')) attrName = props.attr
	const name = `${attrName} (${$actor?.name})`
	IronswornPrerollDialog.showForStat(name, $actor?.system[props.attr], $actor)
}

function increment() {
	const value = parseInt(actorSys.value?.[props.attr]) + 1
	$actor?.update({ system: { [props.attr]: value } })
}
function decrement() {
	const value = parseInt(actorSys.value?.[props.attr]) - 1
	$actor?.update({ system: { [props.attr]: value } })
}
</script>

<style lang="scss" module>
@use 'mixin:text.scss';

.label {
	margin: 0;
	font-size: var(--font-size-14);
	font-weight: bold;
	pointer-events: none;
}

.value {
	margin: 0;
	font-size: var(--font-size-16);
	font-weight: bold;
}

.box {
	--ironsworn-color-text-stroke: var(--ironsworn-color-bg);
	--ironsworn-attr-box-width: 75px;
	@include text.stroke;

	flex: 0 0 var(--ironsworn-attr-box-width);
	border-width: var(--ironsworn-border-width-md);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-lg) !important;
	padding: var(--ironsworn-spacer-lg) 0;
	text-align: center;
	text-transform: uppercase;

	&::before {
		--ironsworn-color-bg-highlight: var(--ironsworn-color-fg);

		transition: opacity var(--ironsworn-transition-timing);
		opacity: 0;
		z-index: 0;
		padding: var(--ironsworn-spacer-sm);
	}

	&:hover {
		&::before {
			opacity: 1;
		}
	}

	input {
		margin-bottom: var(--ironsworn-spacer-md);
		width: 50%;
		text-align: center;
		font-size: var(--font-size-18);
		font-weight: bold;
	}

	& > * {
		position: relative; // must be set to manipulate z-index
		z-index: 1;
	}
}
</style>
