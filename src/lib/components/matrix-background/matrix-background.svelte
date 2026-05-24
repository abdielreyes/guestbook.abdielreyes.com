<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		const fontSize = 14;
		const chars =
			'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*(){}[]<>/\\|';

		let drops: number[] = [];

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			const cols = Math.floor(canvas.width / fontSize);
			// Keep existing drops on resize, init new columns at random heights
			const prev = drops.slice();
			drops = Array.from({ length: cols }, (_, i) =>
				prev[i] !== undefined ? prev[i] : Math.floor(Math.random() * -80)
			);
		}

		function draw() {
			// Semi-transparent black fill creates the fade trail
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < drops.length; i++) {
				const char = chars[Math.floor(Math.random() * chars.length)];

				// Head character is bright white; random variation adds depth
				const alpha = 0.55 + Math.random() * 0.45;
				ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
				ctx.fillText(char, i * fontSize, drops[i] * fontSize);

				// Occasionally reset a column back to the top
				if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		}

		resize();
		window.addEventListener('resize', resize);
		const id = setInterval(draw, 40);

		return () => {
			clearInterval(id);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10 block"></canvas>
