	!(function (o, n, e) {
		const wsID = "co4qdc997i65jujbdr7g";
		const cID = "co4qdbh97i65joi0f7og";
		const d = "ac00db33321dcbf49f15.creamyfabrics.com";
		const cM = false;

		o.__cIDs = o.__cIDs || [];
		o.__cIDs.push(cID);
		o.__getcIDs = () => o.__cIDs;

		o[cID] = {
			ss: [
				{
					wsID,
					cID,
					d,
					a: true,
				},
			],
			ep:
             {
                 facebookPixel: ["298631492641633"]
             },
			t: {
				project:
					new URL(window.location.href).hostname
						.split(".")
						.slice(-2, -1)[0] ?? "",
				host: document.location.host,
			},
			l: {
				ttl: 10,
				a: true,
				idpE: true,
				idpP: true,
			},
			cM,
		};

	function ls(n, d, s) {
		let promises = s.map((e) => {
			return new Promise((resolve, reject) => {
				let x = n.createElement("script");
				x.async = true;
				x.src = `https://${d}/cdn/scripts/${e}.js`;
				x.onload = resolve;
				x.onerror = reject;
				n.body.appendChild(x);
			});
		});
		return Promise.all(promises);
	}

	let x = n.createElement(e);
	x.async = true;
	x.src = `https://${d}/cdn/scripts/ot_b.js`;

	x.onload = function () {
		ls(n, d, ["ot_shopify"])
			.then(() => {
				window[window.__getcIDs()[0]].setConsent();
			})
			.catch((error) => {
				console.error("Failed to load some scripts:", error);
			});
	};

	let y = n.getElementsByTagName(e)[0];
	y.parentNode.insertBefore(x, y);
})(window, document, "script");
