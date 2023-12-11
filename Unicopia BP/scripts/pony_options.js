import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const race_events = [
    'minelp:set_human',
    'minelp:set_earth_pony',
    'minelp:set_pegasus',
    'minelp:set_unicorn',
    'minelp:set_alicorn',
    'minelp:set_changeling',
    'minelp:set_zebra',
    'minelp:set_reformed_changeling',
    'minelp:set_gryphon',
    'minelp:set_hippogriff',
    'minelp:set_kirin',
    'minelp:set_batpony'
];
const tail_l_events = [
    'minelp:tail_stub',
    'minelp:tail_quarter',
    'minelp:tail_half',
    'minelp:tail_three_quarters',
    'minelp:tail_full'
];

world.afterEvents.itemDefinitionEvent.subscribe(data => {
    const { eventName, source } = data;
    if (eventName == 'options_popup') {
        let pony_menu = new ModalFormData();

        pony_menu.title('Pony Options');

        pony_menu.dropdown('Race', ["Human", "Earth pony", "Pegasus", "Unicorn", "Alicorn", "Changeling", "Zebra", "Reformed Changeling", "Gryphon", "Hippogriff", "Kirin", "Batpony"], 1);
        pony_menu.slider('Tail length', 0, 4, 1, 4);
        pony_menu.dropdown('Snout shape', ["Round", "Square", "Flat"], 0);
        pony_menu.dropdown('Body type', ["Foal", "Yearling", "Normal", "Lanky", "Bulky", "Tall"], 2);
        pony_menu.dropdown('Tail shape', ["Straight", "Bumpy", "Swirly", "Spiky"], 0);

        pony_menu.show(source).then(finalize => {
            const { canceled, formValues } = finalize;
            let [race, tail_length, snout_shape, body_type, tail_shape] = formValues;
            if (!canceled) {
                for (let i = 0; i < race_events.length; i++) {
                    switch (race) {
                        case i:
                            source.triggerEvent(race_events[i]);
                    };
                };
                for (let i = 0; i < tail_l_events.length; i++) {
                    switch (tail_length) {
                        case i:
                            source.triggerEvent(tail_l_events[i]);
                    };
                };
            };
        });
    };
});

world.beforeEvents.chatSend.subscribe((chat) => {
    const { message, sender } = chat
    if (message == '/pony menu') {
        sender.triggerEvent('minelp:options_popup');
    }
});