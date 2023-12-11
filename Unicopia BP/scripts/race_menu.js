import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { races } from "scripts/races.js";

world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(data => {
    const { eventName, source } = data;

    if (eventName == "unicopia:race_select") {
        let race_menu = new ActionFormData();
        let on_select = [];

        race_menu.title("Race Select");
        race_menu.body("Select a race");

        for (let i = 0; i < races.length; i++) {
            race_menu.button(races[i].name, 'textures/gui/race/${races[i].icon}');
            on_select.push(races[i].race);
        };

        if (on_select.length > 0) {
            race_menu.show(source).then(showResponse => {
                const { isCancelled, selection } = showResponse;
                if (!isCancelled) {
                    source.triggerEvent(on_select[selection]);
                };
            });
        } else {
            race_menu.button("Close");
            race_menu.show(source);
        };
    };
});