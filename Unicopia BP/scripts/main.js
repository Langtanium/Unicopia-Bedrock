import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

system.beforeEvents.watchdogTerminate.subscribe(info => {
    info.cancel = true;
});

// Stores Race Data
const races = [
    {
        race: "unicopia:human",
        name: "Human",
        variant: 0,
        icon: "textures/gui/race/human.png",
        positive: " - Are omnivores and can eat all types of food except for love\n - Opposable thumbs\n - Walking upright",
        negative: " - Have no magical abilities what-so-ever\n - Need an Elytra to fly\n - Must grow food the old fashioned way, through hard work and manual labour\n - No floppy ears"
    },
    {
        race: "unicopia:earth",
        name: "Earth Pony",
        variant: 1,
        icon: "textures/gui/race/earth.png",
        positive: " - Stronger knockback and resistance to magic\n - Have extra weight makes them effective against magic and brute force\n - A special connection to the earth that makes farming 10,000% more effective!\n - Cute floppy pony ears",
        negative: " - Cannot fly\n - Are weak to certain types of magic\n - Can only eat plants and vegetables"
    },
    {
        race: "unicopia:unicorn",
        name: "Unicorn",
        variant: 3,
        icon: "textures/gui/race/unicorn.png",
        positive: " - Teleportation and magic spells\n - Research and craft magical artefacts that enhance their abilities\n - Can use magic to detect or reveal nearby changelings\n - Have pointy sticks on their heads",
        negative: " - Cannot fly\n - Are weak to brute force attacks\n - Can only eat plants and vegetables"
    },
    {
        race: "unicopia:pegasus",
        name: "Pegasus",
        variant: 2,
        icon: "textures/gui/race/pegasus.png",
        positive: " - Flight and the ability to train to build endurace\n - Use stored mana to dash in short bursts or build it up to perform a powerful rainboom\n - Moves faster and takes less fall damage\n - Can eat vegetables and certain types of fish",
        negative: " - Light weight makes them the weakest to brute force\n - Must rest between flights to regain their strength\n - Cannot use magic without aid from others"
    },
    {
        race: "unicopia:unicorn",
        name: "Alicorn",
        variant: 4,
        icon: "textures/gui/race/alicorn.png",
        positive: " - Same as Unicorn",
        negative: " - Same as Unicorn"
    },
    {
        race: "unicopia:bat",
        name: "Batpony",
        variant: 5,
        icon: "textures/gui/race/bat.png",
        positive: " - Flight and the ability to train to build endurance\n - Sees better in the night\n - Able to cling to the underside of blocks\n - Has a terrifying, yet adorable, but still slightly annoying screech",
        negative: " - Light weight makes them weak to brute force attacks\n - Must rest between flights to regain their strength\n - Is sometimes scared of even themselves\n - Is carnivorous. Can eat anything that doesn't make them sick"
    },
    {
        race: "unicopia:changeling",
        name: "Changeling",
        variant: 6,
        icon: "textures/gui/race/changeling.png",
        positive: " - Able to fly and hover in place\n - Shapeshift and morph into nearly anyone or anyling\n - Is carnivorous. Can eat anything that doesn't make them sick",
        negative: " - Are always starving\n - Requires love, collected from ponies or other hostile mobs to subsidise their diet\n - Becomes sick from eating regular food and must eat love to hasten a cure"
    }
];
const menu_info = [
    "§6Select Your Tribe",
    "A journey into magic and adventure awaits, traveller! But before you go, you must select your path.\nChoose wisely, for the choice you make now will change the world around you and the paths you may take.",
];

// Menu UI
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(trigger => {
    const { entity, id } = trigger;

    if (id == "unicopia:tribe_select") {
        let race_menu = new ActionFormData();
        let select = [];

        race_menu.title(menu_info[0]);
        race_menu.body(menu_info[1]);

        for (let i = 0; i < races.length; i++) {
            race_menu.button(races[i].name, races[i].icon);
            select.push(races[i].race);
        };

        race_menu.show(entity).then(showResponse => {
            const { canceled, selection } = showResponse;
            if (!canceled) {
                let accept_menu = new ActionFormData();
                accept_menu.title("You have selected §6" + races[selection].name);
                accept_menu.body("§6" + races[selection].name + " enjoy the following perks:\n§f" + races[selection].positive + "\n§6but they...\n§f" + races[selection].negative);
                accept_menu.button("Join Tribe");
                accept_menu.button("Go Back");
                accept_menu.show(entity).then(accept => {
                    const is_canceled = accept.canceled;
                    const selection_id = accept.selection;
                    if (!is_canceled && selection_id == 0) {
                        entity.triggerEvent(select[selection]);
                    };
                    if (is_canceled || selection_id == 1) {
                        entity.triggerEvent("unicopia:tribe_select");
                    };
                });
            } else {
                entity.triggerEvent("unicopia:tribe_select");
            };
        });
    };
});

world.afterEvents.itemDefinitionEvent.subscribe(usedItem => {
    const { eventName, source } = usedItem;

    if (eventName == "unicopia:race_select") {
        source.triggerEvent("unicopia:tribe_select");
    };
});

world.afterEvents.entityDie.subscribe(getDeath => {
    const { deadEntity } = getDeath;

    if (deadEntity.typeId == 'minecraft:player') {
        deadEntity.triggerEvent("unicopia:tribe_selcet_dead");
    };
});

// Damages player when breaking Zap related blocks
world.afterEvents.entityHitBlock.subscribe(hitter => {
    const { damagingEntity, hitBlock } = hitter;

    if (hitBlock.typeId == 'unicopia:zap_log') {
        damagingEntity.applyDamage(4);
    };
});

// Prevents the placement of edible vegitation
world.beforeEvents.itemUseOn.subscribe(usedBlock => {
    const { itemStack, source } = usedBlock;
    if ((usedBlock.itemStack.typeId == 'minecraft:red_flower' || usedBlock.itemStack.typeId == 'minecraft:yellow_flower') && usedBlock.source.getComponent('minecraft:variant') == 1) {
        usedBlock.cancel = true;
        itemStack.amount = usedBlock.itemStack.amount - 1;
        source.runCommandAsync('effect @s saturation 1 2 false');
        source.runCommandAsync('playsound random.eat @s');
    };
});

world.afterEvents.itemCompleteUse.subscribe(usedItem => {
    const { itemStack, source } = usedItem;
    //itemStack.setLore([itemStack.nameTag, '§cWant It Need It']);
});

