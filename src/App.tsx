import React from "react";
import "./styles/index.less";
import {
	ApiRequest,
	TRIGGER_ID,
} from "@rocketman-system/streamkit-widget-helper";

const audio = new Audio(require("./media/bsod.mp3").default);

export const App = React.memo(() => {
	const [loaded, setLoaded] = React.useState(false);
	const [data, setData] = React.useState<{
		/** ID of the effect these data belong to */
		effectId: string;
		/** Unique ID of this trigger */
		triggerId: string;
		/** How long to display the effect (in seconds) */
		seconds: number;
		/** Effect volume level (0-100) */
		volume: number;
		/** Name of the effect sender */
		name?: string;
		/** Message from the sender */
		message?: string;
		/** Donation amount (if donation)
		 * @example 100 USD
		 */
		amount?: string;
	}>();
	const [timer, setTimer] = React.useState(0);

	React.useEffect(() => {
		const tm = setInterval(() => {
		setTimer(old => {
			return Math.min(99, old + 1);
		});
		}, 1000);

		return () => {
			clearTimeout(tm);
		};
	}, []);

	React.useEffect(() => {
		ApiRequest("GET", "private/effect/loadData", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setData(data);
			setLoaded(true);
		});
	}, []);

	React.useEffect(() => {
		if (!loaded || !data?.volume) return;
		audio.currentTime = 0;
		audio.play();
		audio.autoplay = true;
		audio.volume = data.volume / 100;

		audio.onended = () => {
			audio.currentTime = 16.46;
			audio.play();
		};

		return () => {
			audio.pause();
		};
	}, [loaded, data]);

	if (!loaded) return <></>;

	return (
		<div className={`bsod`}>
        <div className="title">:(</div>
        <div className="desc">
          Your PC ran into a problem and needs to restart. We're just collecting
          some error info, and then we'll restart for you.
        </div>
        <div className="timer">{timer}% complete</div>
      </div>
	);
});
