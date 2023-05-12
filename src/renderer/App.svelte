<script>
  const { ipcRenderer, shell } = require('electron');
	import { Dropdown, DropdownItem, Button, Indicator, Modal, Label, Input } from 'flowbite-svelte'

  import { onMount } from 'svelte';

	let domains = []

	let newDomain = {
		protocol: 'http',
		host: null,
		port: null,
	}
	let addModalOpen = false

	onMount(async () => {
		await getDomains()		
	});

	const openInBrowser = (url) => {
		shell.openExternal(url);
	}
	
	const removeDomain = async (id) => {
		await ipcRenderer.invoke('domains:remove', id)
		await getDomains()
	}
	const getDomains = async () => {
		domains = await ipcRenderer.invoke('domains:all')
	}
	const addDomain = async () => {
		await ipcRenderer.invoke('domains:add', {
			protocol: newDomain.protocol,
			host: newDomain.host,
			port: parseInt(newDomain.port),
		})
		newDomain = {
			host: null,
			protocol: 'http',
			port: null,
		}
		addModalOpen = false
		await getDomains()
	}
	
	const openModalAddDomain = () => {
		addModalOpen = true
	}
	let refreshButtonClass = ''
	const refresh = async () => {
		refreshButtonClass = 'animate-spin'
		await getDomains()
		setTimeout(() => {
			refreshButtonClass = 'text-green-500'
		}, 1000)
		setTimeout(() => {
			refreshButtonClass = ''
		}, 2000)
	}
</script>
<div class="dark bg-zinc-950 text-white w-full h-full overflow-auto">
	<main class="p-3">
		<div class="flex justify-between my-3">
			<h1 class="font-bold text-xl">Domains</h1>
			<div class="flex space-x-3">
				<Button on:click={refresh} class="focus:ring-0 dark:focus:ring-0">
					<svg class="{refreshButtonClass} w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>					
				</Button>
				<Button class="dark:bg-zinc-800 rounded-lg" size="sm" on:click={openModalAddDomain}>
					New
				</Button>
			</div>
		</div>
		<div class="flex flex-col w-full bg-zinc-900 divide-y divide-zinc-950 rounded-2xl">
			{#each domains as domain}
				<div class="flex space-x-3 p-3 py-4 items-center">
					<span class="text-gray-500">
						{domain.protocol}
					</span>
					<span class="px-2 flex-1">
						{domain.host}
					</span>
					<span class="flex-2 text-gray-500">
						{domain.port}
					</span>
					<div class="flex justify-end w-32 px-3">
						{#if domain.active}
						<div class="flex items-center bg-zinc-800 px-2 py-1 rounded-xl text-sm">
							<Indicator size="xs" color="green" class="mr-1.5" />
							Open
						</div>
						{:else}
							<div class="flex items-center bg-zinc-800 px-2 py-1 rounded-xl text-sm">
								<Indicator size="xs" color="red" class="mr-1.5" />
								Not open
							</div>
						{/if}
					</div>
					<button on:click={() => openInBrowser(domain.url)} class="flex-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>						
					</button>
					<div class="flex-3">
						<Button class="!p-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
							</svg>							
						</Button>
						<Dropdown placement="bottom-end">
							<DropdownItem on:click={removeDomain(domain.id)}>Remove</DropdownItem>
						</Dropdown>
					</div>
				</div>
			{/each}
		</div>

		<Modal bind:open={addModalOpen} backdropClasses="bg-zinc-950 bg-opacity-50 dark:bg-opacity-80" defaultClass="relative flex flex-col mx-auto dark:bg-zinc-800 w-full">
			<form class="flex flex-col space-y-6" on:submit|preventDefault={addDomain}>
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add new local domain</h3>
				<Label class="space-y-2">
					<span>Host</span>
					<Input type="text" name="host" bind:value={newDomain.host} placeholder="app.local" required />
				</Label>
				<Label class="space-y-2">
					<span>Port</span>
					<Input type="number" name="port" bind:value={newDomain.port} placeholder="5173" required />
				</Label>
				<Button type="submit" class="w-full" color="green">Add local domain</Button>
			</form>
		</Modal>
		
	</main>
</div>