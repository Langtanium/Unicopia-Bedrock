gamerule sendcommandfeedback false
event entity @a[tag=!entered] unicopia:tribe_select
#replaceitem entity @a[tag=!entered] slot.hotbar 1 minelp:options 1 0 {"item_lock":{"mode":"lock_in_inventory"},"keep_on_death":{}}
tag @a[tag=!entered] add entered