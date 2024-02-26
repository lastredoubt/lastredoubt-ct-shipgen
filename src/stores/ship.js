
// called with "shipInfo" via "currentShipStore"
// also exports : 

    // ** clearShipQ, 
    // shipType, 
    // shipDescription, 
    // shipSpecs

import { ref, computed, shallowRef , reactive} from 'vue'
import { defineStore } from 'pinia'



import { ShipRules } from '../assets/ShipTables';
const tables = ShipRules


// export const useCounterStore = defineStore('counter', () => {
export const currentShipStore = defineStore('shipInfo', () => {

const shipType = ref('Scout/Courier (type S)')
const shipName = ref('(none)')
const shipDescription = ref("Scout/Courier (type S ) : Using a 100-ton hull, the scout/courier is intended for exploration, survey, and courier duties, with many in service throughout known space. It mounts jump drive-A, maneuver drive-A, and power plant-A, giving performance of jump-2 and 2-G acceleration. Fuel tankage of 40 tons supports the power plant and one jump-2. Adjacent to its bridge is acomputer Model1/bis. There are four staterooms and no low berths. The ship has one hardpoint and one ton allocated to fire control. Installed on the hardpoint is one double turret, but no weaponry is mounted. There is one ship's vehicle: an air/raft. Cargo capacity is 3 tons. The hull is streamlined. The scout/courier requires a crew of one: pilot/engineer. The ship can carry three passengers (up to seven passengers double occupancy) in non-commercial service only. The ship costs MCr29.43 (including 10% discount for standard designs) and takes 9 months to build.")
const hullClassList =  [
    5000,4000,3000,2000,1000,800,600,400,200,100
]   

const shipSpecs = reactive({
    hullMass: 100,
    jumpDrive: 'A',
    powerPlant: 'A',
    maneuverDrive: 'A',
    fuelTankage: 40,
    computer: '1bis',
    staterooms: 4,
    lowBerths: 0,
    emergencyBerths: 0,
    hardpoints: [
        {
            id: 'scout-s-hp01',
            fireControl: true,
            turretSize: 'double',
            turretMounts: [
                { position: 1 , type: 'empty', present: true }, //type zero corresponds to empty on lookuptable
                { position: 2 , type: 'empty', present: true }, //type zero corresponds to empty on lookuptable               
                { position: 3 , type: 'empty', present: false } //type zero corresponds to empty on lookuptable               
            ],
        },
    ],
    streamlined: true,
    stdHull: true,
    stdDesign: true,
    refCost: 29.43,
    vehicles: [
        { id:'scout-s-v01', type: 'airraft'}, // used to lookup tonange / costs
    ],

    smallCraft: [],
    // CARGO is computed

})

const shipBridge = reactive ({
    minTons: 20,
    percentage: 0.02
})

 /*---------------------------------------------------------------------

 FUNCTIONS

 /*---------------------------------------------------------------------*/

//   function setHullMass(newMass) {
//     shipSpecs.hullMass = newMass
//   }

 /*---------------------------------------------------------------------

 Computed

 /*---------------------------------------------------------------------*/
 /*--------------------------------------------

 shipHullClass
    console.log('> ship.js shipHullClass - computing hull class: Current Mass is derived from : shipSpecs.hullMass  :  ' + shipSpecs.hullMass)

 /*--------------------------------------------*/

  const shipHullClass = computed(() => {
  
    let classMass = 0
    console.log('> ship.js shipHullClass - computing hull class: Current Mass is derived from : shipSpecs.hullMass  :  ' + shipSpecs.hullMass)
    
    for (const checkMass of hullClassList) {
  
        // console.log(' --- vs hull class checkMass of ' + checkMass)

      if (checkMass >= shipSpecs.hullMass) {
        classMass = checkMass
        // console.log(' -------- new classMass:  ' + classMass)
      }
    }

    console.log('--- Return hull class  :  ' + classMass)
    return classMass
  
 })


 /*--------------------------------------------

 getHullMass

 /*--------------------------------------------*/

 const getHullMass = computed(() => {
    console.log('> ship.js getHullMass - getter for : shipSpecs.hullMass')

    return shipSpecs.hullMass
  
 })

 /*--------------------------------------------

 engineeringMass

 /*--------------------------------------------*/

 const engineeringMass = computed(() => {
    console.log('> ship.js engineeringMass - Total mass of drives')

    let enginesMass = 0
    // pp mass
    enginesMass += tables.powerPlant[shipSpecs.powerPlant].mass
    // md mass
    enginesMass += tables.maneuverDrive[shipSpecs.maneuverDrive].mass
    // jd mass
    enginesMass += tables.jumpDrive[shipSpecs.jumpDrive].mass


    console.log('--- engineeringMass: ' + enginesMass)
  
    return enginesMass
 })

 /*--------------------------------------------

 minFuelTankage

 /*--------------------------------------------*/

 const minFuelTankage = computed(() => {
    console.log('> ship.js minFuelTankage - ')

    let classMass = 0
    
    for (const checkMass of hullClassList) {
  
      if (checkMass >= shipSpecs.hullMass) {
        classMass = checkMass
      }
    }

    const jumpFuelMin = 0.1 * shipSpecs.hullMass * tables.hullTables[classMass].performance[shipSpecs.jumpDrive]
    
    const powermaneuverMin = tables.hullTables[classMass].performance[shipSpecs.powerPlant] * 10
    const fuelUsage = jumpFuelMin + powermaneuverMin
    console.log('Fuel Usage ' + fuelUsage )


    console.log('--- ship.js minFuelTankage - ' + fuelUsage)
    return fuelUsage
  
 })


 /*--------------------------------------------

 jumpFuelTankageMin - instead of overall tankage, 
 just the jump requirements

 /*--------------------------------------------*/

 const jumpFuelTankageMin = computed(() => {
    console.log('> ship.js jumpFuelTankageMin - ')

    let classMass = 0
    
    for (const checkMass of hullClassList) {
  
      if (checkMass >= shipSpecs.hullMass) {
        classMass = checkMass
      }
    }

    const jumpFuelMin = 0.1 * shipSpecs.hullMass * tables.hullTables[classMass].performance[shipSpecs.jumpDrive]
    
    console.log('--- jumpFuelTankageMin: '+ jumpFuelMin)

    return jumpFuelMin
  
 })



 /*--------------------------------------------

 powerfuelTankageMin - how much for just power

 used to calculate jump range

 /*--------------------------------------------*/
 const powerfuelTankageMin = computed(() => {

    console.log('> ship.js powerfuelTankageMin - ')
    let classMass = 0
    
    for (const checkMass of hullClassList) {
  
      if (checkMass >= shipSpecs.hullMass) {
        classMass = checkMass
      }
    }
   
    const powermaneuverMin = tables.hullTables[classMass].performance[shipSpecs.powerPlant] * 10
    console.log('---powerfuelTankageMin: '+ powermaneuverMin)
    return powermaneuverMin
  
 })



 /*--------------------------------------------

 bridgeTons - how much tonnage for the bridge?

 /*--------------------------------------------*/

 const bridgeTons = computed(() => {
    console.log('> ship.js bridgeTons - ')

    let bridgeMass = 0
    //bridge mass
    const minBrTons = shipBridge.minTons
    const minBrPercentage = shipBridge.percentage * shipSpecs.hullMass
    if (minBrTons >  minBrPercentage ) {
        bridgeMass += minBrTons
    } else { bridgeMass += minBrPercentage }

    console.log('--- bridgeTons - ' + bridgeMass)
    return bridgeMass

 })
 


 /*------------------------------------------------------------------------------

 customHullCost - MCrO.1 per ton 


 /*------------------------------------------------------------------------------*/


 const customHullCost = computed(() => {
  console.log('> ship.js customHullCost - ')
  
  const hullCostRatio  = 0.1
  const hullCost = shipSpecs.hullMass * hullCostRatio


  console.log('--- ship.js customHullCost: '+ hullCost)
  return hullCost

})


 /*------------------------------------------------------------------------------

 hardpointLimit - 1 per 100 tons

 /*------------------------------------------------------------------------------*/


 const hardpointLimit = computed(() => {
  console.log('> ship.js hardpointLimit - ')

  const hullLimit = Math.floor(shipSpecs.hullMass / 100)

  console.log('--- ship.js hardpointLimit: '+ hullLimit)
  return hullLimit

})




 /*------------------------------------------------------------------------------

 tonnageSum - Adding up total tonnage

 /*------------------------------------------------------------------------------*/


 const tonnageSum = computed(() => {
    console.log('> ship.js tonnageSum - ')

    let hullTonnage = 0

    //bridge mass
    const minBrTons = shipBridge.minTons
    const minBrPercentage = shipBridge.percentage * shipSpecs.hullMass
    if (minBrTons >  minBrPercentage ) {
        hullTonnage += minBrTons
    } else { hullTonnage += minBrPercentage }

    // pp mass
    hullTonnage += tables.powerPlant[shipSpecs.powerPlant].mass
    // md mass
    hullTonnage += tables.maneuverDrive[shipSpecs.maneuverDrive].mass
    // jd mass
    hullTonnage += tables.jumpDrive[shipSpecs.jumpDrive].mass
    // fuel tankage
    hullTonnage += Number(shipSpecs.fuelTankage)
    // computer mass
    hullTonnage += Number(    tables.computers[shipSpecs.computer].tons  )

    // Staterooms
    const stateRoomMass = Number(tables.berthing.stateroom.mass * shipSpecs.staterooms)
    hullTonnage +=     stateRoomMass
    
    // low berths
    const lowBerthMass = Number(tables.berthing.lowberth.mass * shipSpecs.lowBerths)
    hullTonnage +=     lowBerthMass

    
    // emergency low berths
    const eLowBerthMass = Number(tables.berthing.emergencylow.mass * shipSpecs.emergencyBerths)
    hullTonnage +=     eLowBerthMass

    // fire control ------------------------------------------------------------
    let fireControlTotal = 0
    // console.log('--- ship.js tonnageSum:  HARDPOINTS'+ shipSpecs.hardpoints)
    // console.log(shipSpecs.hardpoints)
    for (const presentHardpoint of shipSpecs.hardpoints) {
      // console.log(presentHardpoint)
      // console.log('HARDPOINT: presentHardpoint.fireControl: ' + presentHardpoint.fireControl)
      if (presentHardpoint.fireControl) { fireControlTotal += tables.fireControlTonnage}
    }
    hullTonnage +=     fireControlTotal


    // vehicles ------------------------------------------------------------
    let vehicleTotal = 0
    for(const currentVehicle of shipSpecs.vehicles) {
      vehicleTotal += tables.vehicles[currentVehicle.type].mass
    }
    hullTonnage += vehicleTotal



    // small craft ------------------------------------------------------------
    let scTotal = 0
    for(const currentCraft of shipSpecs.smallCraft) {
      scTotal += tables.smallCraft[currentCraft.type].mass
    }
    hullTonnage += scTotal




    console.log('--- ship.js tonnageSum: '+ hullTonnage)
    return hullTonnage
  
 })






 /*---------------------------------------------------------------------

            FUNCTIONS!!!!

 /*---------------------------------------------------------------------*/




 /*--------------------------------------------

 removeHardpoint

 /*--------------------------------------------*/
 function removeHardpoint(theIndex) {
  // removeHardpoint: function (theIndex) {
  console.log('testRemoveHardpoint from shipSpecs.hardpoints')

  this.shipSpecs.hardpoints.splice(theIndex, 1);

  console.log('Again - ')
  console.log(shipSpecs.hardpoints  )

}



 /*--------------------------------------------

 removeVehicle

 /*--------------------------------------------*/
 function removeVehicle(theIndex) {
  // removeHardpoint: function (theIndex) {
  console.log('removeVehicle from shipSpecs.vehicles')

  this.shipSpecs.vehicles.splice(theIndex, 1);

  console.log('Again - ')
  console.log(shipSpecs.vehicles  )

}




 /*--------------------------------------------

 removeSmallCraft

 /*--------------------------------------------*/
 function removeSmallCraft(theIndex) {
  // removeHardpoint: function (theIndex) {
  console.log('removeSmallCraft from shipSpecs.smallCraft')

  this.shipSpecs.smallCraft.splice(theIndex, 1);

  console.log('Again - ')
  console.log(shipSpecs.smallCraft  )

}





 /*---------------------------------------------------------------------

            RETURNS!!!!

 /*---------------------------------------------------------------------*/

  return { shipSpecs,shipType, shipName, shipDescription, minFuelTankage,shipBridge, hullClassList, shipHullClass, getHullMass, tonnageSum, bridgeTons,jumpFuelTankageMin,powerfuelTankageMin, engineeringMass , customHullCost, hardpointLimit,removeHardpoint,removeVehicle,removeSmallCraft}
})

