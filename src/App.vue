
<template>

  <div ref="shipSlot">
    
  </div>
  
    <!---
    =======================================================================
    
              LEFT side
  
    =======================================================================  
    -->
  
  
    <div class="lrctshipbuild-left">
  
  
    <!---
    =======================================================================
    
              Header Area
  
    =======================================================================  
    -->
  
      <div class="lrctshipbuild-header">
        <h1> Welcome to the Classic Traveller Ship Builder</h1>
        <p>
            Interactive Classic Traveller Ship Construction. <br><br>
            (we'll eventually let you preload all of the standard ships, but for now just preload the scout) <br></p>
      </div>
  
  
  
    <!---
    =======================================================================
    
              Current actions and feedback
              
    =======================================================================  
    -->
   
  
  
      <div class="lrctshipbuild-current">
  
        <div id="creationUI">

          <div class = "lrctshipbuild-textline">
            <label for="ctShipName">Ship name:</label>
            <input type="text" id="ctShipName" name="ctShipName" v-model.trim="shipName" @focus="$event.target.select()">
          </div>


          <div class = "lrctshipbuild-textline">
            <label for="ctShipType">Ship type:</label>
            <input type="text" id="ctShipType" name="ctShipType" v-model.trim="shipType" @focus="$event.target.select()">
          </div>

          <hr>
          <h2>Hull</h2>

          <div class = "lrctshipbuild-textline">

            <div id="hullTypePicker">
              <h3>General Design: </h3>
              <input v-model="hullTypePicker" type="radio" id="stdSizePickerStd" name="stdSizePicker" value="std">              
                <label for="stdSizePickerStd">Choose a Std hull</label>


              <input v-model="hullTypePicker" type="radio" id="stdSizePickeCustomr" name="stdSizePicker" value="custom">
                            
                <label for="stdSizePickeCustomr">Choose a Custom hull</label>


  <div>
    <input type="checkbox" id="streamline-checkbox" name="streamline-checkbox" v-model="shipSpecs.streamlined" />
    <label for="streamline-checkbox">Streamlined</label>
  </div>


            </div>





            <div id="hullpicker" v-if="hullTypePicker == 'std'">
              <label for="stdSizePicker">Choose a hull size:  </label>

              <select id="stdSizePicker" v-model="stdHullPicker">
                <option v-for="(stdHullOpt, index) in tables.hullTables.stdSizes" :value="stdHullOpt" :key="'stdhullopt'+index">
                  {{ stdHullOpt }} tons, {{ tables.hullTables[stdHullOpt].stdCost }} MCr, {{ tables.hullTables[stdHullOpt].stdDriveLimit }} max engine tonange
                </option>
              </select>
            </div>


            




            <div id="customHull" v-if="hullTypePicker=='custom'">
              <label for="ctHullSize"> Enter a custom hull size between 100 and 5000 tons:</label>
              <input type="text" id="ctHullSize" name="ctHullSize" v-model.lazy.number="shipSpecs.hullMass" @focus="$event.target.select()">
              <p v-if="hullTooSmall" class="error-text">Hull size less than minimum of {{ tables.minHullSize }}</p>
              <p v-if="hullTooLarge" class="error-text">Hull size more than maximum of {{ tables.maxHullSize }}</p>
            </div>
          
          </div>


          <hr>
          <h2>Engineering</h2>

          <div class = "lrctshipbuild-textline">
            <label for="select-power-plant">Power Plant:</label>
            <select name="select-power-plant" id="select-power-plant" v-model="shipSpecs.powerPlant">
              <option v-for="(plant, index) in shipPowerArray" :value="plant.type"> Power plant type {{ plant.type }} : mass: {{ plant.values.mass }} tons, cost: {{ plant.values.cost  }} MCr</option>
            </select>
            <p class="error-text" v-if="!selectedPlantValidTypePower">Previously selected power plant doesn't match available types. Please choose a new one</p>
         </div>



          <div class = "lrctshipbuild-textline">
            <label for="select-maneuver-drive">Maneuver drive:</label>
            <select name="select-maneuver-drive" id="select-maneuver-drive" v-model="shipSpecs.maneuverDrive">
              <option v-for="(plant, index) in shipManeuverArray" :value="plant.type"> Maneuver drive type {{ plant.type }} : mass: {{ plant.values.mass }} tons, cost: {{ plant.values.cost  }} MCr, {{ plant.performance }} g</option>
            </select>
            <p v-if="mDriveExceedPPRating" class="error-text">Maneuver Drive is too large for power plant type {{ shipSpecs.powerPlant }}</p>

            <p class="error-text" v-if="!selectedPlantValidTypeManeuver">Previously selected maneuver drive doesn't match available types. Please choose a new one</p>


          </div>

  

         <div class = "lrctshipbuild-textline">
            <label for="select-jump-drive">Jump drive:</label>
            <select name="select-jump-drive" id="select-jump-drive" v-model="shipSpecs.jumpDrive">
              <option v-for="(plant, index) in shipJumpArray" :value="plant.type"> Jump drive type {{ plant.type }} : mass: {{ plant.values.mass }} tons, cost: {{ plant.values.cost  }} MCr, jump: {{ plant.performance }}</option>
            </select>
            <p v-if="jDriveExceedPPRating" class="error-text">Jump Drive is too large for power plant type {{ shipSpecs.powerPlant }}</p>
<!-- selectedPlantValidTypeJump -->
            <p class="error-text" v-if="!selectedPlantValidTypeJump">Previously selected jump drive doesn't match available types. Please choose a new one</p>

         </div>

  
  

         <div class = "lrctshipbuild-textline">
            <label for="edit-fuel-tankage">Fuel Tankage:</label>
            <input type="text" id="edit-fuel-tankage" name="edit-fuel-tankage" v-model.lazy="shipSpecs.fuelTankage" @focus="$event.target.select()">
            <p v-if="notEnoughFuel"  class="error-text"> Not enough fuel for operations</p>
         </div>
  
        <hr>
        <h2>Control</h2>
  
  

        <div class = "lrctshipbuild-textline">
            <label for="choose-computer-model">Computer Model:</label>
            
            <select name="choose-computer-model" id="choose-computer-model" v-model="shipSpecs.computer">
              <option v-for="(computer, index) in tables.computers.listing" :value="computer">  {{ tables.computers[computer].name }} : mass: {{ tables.computers[computer].tons }} tons, jump rating: {{ tables.computers[computer].jumpRating }}, TL: {{ tables.computers[computer].TL }}, capacity: {{ tables.computers[computer].ramCapacity }}/{{ tables.computers[computer].storageCapacity }}  cost: {{ tables.computers[computer].cost  }} MCr, </option>
            </select>
            <p v-if="computerJumpMismatch"  class="error-text"> Computer insufficient for jump drive rating</p>
        </div>

        <h2>Berthing</h2>

        <p>Number of staterooms:  
        <button @click="shipSpecs.staterooms-=5" v-if="shipSpecs.staterooms >= 5">- 5</button>
        <button @click="shipSpecs.staterooms--" v-if="shipSpecs.staterooms >=1">- 1</button>
        {{ shipSpecs.staterooms }}
        <button @click="shipSpecs.staterooms++">+ 1</button>
        <button @click="shipSpecs.staterooms+=5">+ 5</button>
        (1 passenger, up to two crew double occupancy for non-commercial ships) </p>


        <p>Number of low berths: 
        <button @click="shipSpecs.lowBerths-=5" v-if="shipSpecs.lowBerths >= 5">- 5</button>
        <button @click="shipSpecs.lowBerths--" v-if="shipSpecs.lowBerths >=1">- 1</button>
        {{ shipSpecs.lowBerths }}
        <button @click="shipSpecs.lowBerths++">+ 1</button>
        <button @click="shipSpecs.lowBerths+=5">+ 5</button>
        ( hibernation for 1 passenger) </p>



        <p>Number of emergency low berths:  
        <button @click="shipSpecs.emergencyBerths-=5" v-if="shipSpecs.emergencyBerths >= 5">- 5</button>
        <button @click="shipSpecs.emergencyBerths--" v-if="shipSpecs.emergencyBerths >=1">- 1</button>
        {{ shipSpecs.emergencyBerths }}
        <button @click="shipSpecs.emergencyBerths++">+ 1</button>
        <button @click="shipSpecs.emergencyBerths+=5">+ 5</button>
        ( emergency hibernation for up to 4 passengers) </p>
        <p>-- eventually we'll see if we can figure out minimum crew requirements here</p>



        <h2>Weapons</h2>



        <div class = "lrctshipbuild-textline">

          <button @click="addHardpoint" v-if="!haveMaxHardpoints">Add Hardpoint (limit {{ currentShip.hardpointLimit }})</button>
        
        </div>


        <div class = "lrctshipbuild-turretlist" id="turretlist">
          <p class="error-text" v-if="excessHardpoints"> Too many hardpoints for hull size! </p>
          <table>
            <tr>
              <th>Hardpoint #</th>
              <th>Fire Control</th>
              <th>Turret Type</th>
              <th>Weapons</th>
              <th>delete</th>
            </tr>
            <tr v-for="(mountPoint,index) in currentShip.shipSpecs.hardpoints" key="{{ mountPoint.id }}">
              <td>{{ index + 1 }}</td>
                  <td> 
                  <input type="checkbox" :id="'fc-check-'+index" :name="'fc-check-'+index" v-model="currentShip.shipSpecs.hardpoints[index].fireControl" />
                  {{ mountPoint.fireControl ? "yes, 1 ton" : '(none present)' }}
                </td>
              <td>
   


                <select v-if="currentShip.shipSpecs.hardpoints[index].fireControl"  @change="updateTurrCount(currentShip.shipSpecs.hardpoints[index])"  :name="'turrtype'+index" :id="'turrtype' + index" v-model="currentShip.shipSpecs.hardpoints[index].turretSize">

                  <option v-for="(key) in tables.turrets" :value="key.idName">
                    {{ key.name }}
                  </option>
                </select>
              
              </td>
              <td>



                          
                        <div  v-if="currentShip.shipSpecs.hardpoints[index].fireControl" >



                          <div  v-if="mountPoint.turretMounts[0].present" >

                          <label for="weptype1" > Mount 1:</label>

                            <select name="weptype1" id="weptype1" v-model="currentShip.shipSpecs.hardpoints[index].turretMounts[0].type">
                                
                                <option v-for="(key) in tables.weapons" :value="key.idName">
                                  {{ key.name }}
                                </option>
                            </select>
                          </div>



                        
                          <div  v-if="mountPoint.turretMounts[1].present" >
                          <label for="weptype2" > Mount 2:</label>

                            <select name="weptype2" id="weptype2" v-model="currentShip.shipSpecs.hardpoints[index].turretMounts[1].type">
                                
                                <option v-for="(key) in tables.weapons" :value="key.idName">
                                  {{ key.name }}
                                </option>
                            </select>
                          </div>



                        
                          <div  v-if="mountPoint.turretMounts[2].present" >
                          <label for="weptype3" > Mount 3:</label>

                            <select name="weptype3" id="weptype3" v-model="currentShip.shipSpecs.hardpoints[index].turretMounts[2].type">
                                
                                <option v-for="(key) in tables.weapons" :value="key.idName">
                                  {{ key.name }}
                                </option>
                            </select>
                          </div>
                        </div>









              </td>
              <td><button @click="currentShip.removeHardpoint(index)">Delete</button></td>
            </tr>

          </table>

          
        </div>





        <!--
        <div class = "lrctshipbuild-textline">
            <label for="choose-computer-model">Computer Model:</label>
            
            <select name="choose-computer-model" id="choose-computer-model" v-model="shipSpecs.computer">
              <option v-for="(computer, index) in tables.computers.listing" :value="computer">  {{ tables.computers[computer].name }} : mass: {{ tables.computers[computer].tons }} tons, jump rating: {{ tables.computers[computer].jumpRating }}, TL: {{ tables.computers[computer].TL }}, capacity: {{ tables.computers[computer].ramCapacity }}/{{ tables.computers[computer].storageCapacity }}  cost: {{ tables.computers[computer].cost  }} MCr, </option>
            </select>
            <p v-if="computerJumpMismatch"  class="error-text"> Computer insufficient for jump drive rating</p>
        </div>

-->
  



<h2>Vehicles</h2>



<div class = "lrctshipbuild-textline">

  <p class="error-text" v-if="excessTonnage && (currentShip.shipSpecs.vehicles.length > 0)">Total ship mass exceeds hull mass. Please verify you do not have too much mass allocated to vehicles </p>

  <button @click="addVehicle" >Add Vehicle</button>

</div>


<div class = "lrctshipbuild-vehicleList" id="vehicleList">
          <table>
            <tr>
              <th>Vehicle #</th>
              <th>Type</th>
              <th>Mass</th>
              <th>Cost</th>
              <th>delete</th>
            </tr>
            <tr v-for="(vehicle, index) in currentShip.shipSpecs.vehicles" :key="vehicle.id">
              <td>{{index+1}}</td>
              <td>

                <select v-model="currentShip.shipSpecs.vehicles[index].type" 
                :name="'choose-vehicle-type' + vehicle.id" 
                :id="'choose-vehicle-type' + vehicle.id"     >

                  <option :value="vKey" v-for="(vKey   ) in tables.vehiclesList" >
                    {{ tables.vehicles[vKey].name }}
                  </option>             
              </select>

              
              </td>
              <td>{{ tables.vehicles[vehicle.type].mass }}</td>
              <td>{{ tables.vehicles[vehicle.type].cost }}</td>
              <td><button @click="currentShip.removeVehicle(index)">Delete</button></td>
            </tr>

          </table>
</div>









<h2>Small Craft</h2>




<div class = "lrctshipbuild-textline">

  <p class="error-text" v-if="excessTonnage && (currentShip.shipSpecs.smallCraft.length > 0)">Total ship mass exceeds hull mass. Please verify you do not have too much mass allocated to small craft </p>

<button @click="addCraft" >Add Craft</button>

</div>


<div class = "lrctshipbuild-craftList" id="craftList">
        <table>
          <tr>
            <th>Craft #</th>
            <th>Type</th>
            <th>Mass</th>
            <th>Cost</th>
            <th>delete</th>
          </tr>
          <tr v-for="(craft, index) in currentShip.shipSpecs.smallCraft" :key="craft.id">
            <td>{{index+1}}</td>
            <td>

              <select 
              v-model="currentShip.shipSpecs.smallCraft[index].type" 
              :name="'choose-vehicle-type' + craft.id" 
              :id="'choose-vehicle-type' + craft.id"          >

                <option 
                  :value="vKey" 
                  v-for="(vKey   ) in tables.smallCraftList"      >
                  {{ tables.smallCraft[vKey].name }}
                </option>             
            </select>

            
            </td>
            <td>{{ tables.smallCraft[craft.type].mass }}</td>
            <td>{{ tables.smallCraft[craft.type].cost }}</td>
            <td><button @click="currentShip.removeSmallCraft(index)">Delete</button></td>
          </tr>

        </table>
</div>




<h2>Description</h2>




<div class = "lrctshipbuild-textline">
      <div id="shipDescriptionDiv">
      <label for="shipDescription">Ship Description:</label>
    </div>
  <textarea id="shipDescription" name="shipDescription" rows="4" cols="50" v-model="shipDescription">
</textarea>



</div>













  
         <!--   end ov creation UI -->
        </div>
  <!---
  
  ------------------------------------------------------------------------------------
  ------------------------------------------------------------------------------------
  ------------------------------------------------------------------------------------
  -->
 <!--  
        <div class="resetButton" >
          <hr>
          <button @click.prevent="reloadPage">Load other standard ships [[not implemented]]</button>
  
      </div>
  -->
<!--    
       <div class="careerLog">
        <hr>
        <h1>Creation Log</h1>
          <p v-for="(step,index) in creationStatus.careerLog" :key="'careerLog-'+index">{{step}}</p>
        </div>
  
  -->



      </div>
  
    </div>
  
    <!---
    =======================================================================
    
              Ship SHEET
    =======================================================================  
    -->
  
    <div class="lrctshipbuild-shipsheet">
    
      <table class="lrctshipbuild-shiptable">
        <tr>  <!-- header row -->
          <th colspan="2">TAS form 3d</th>
          <th colspan="4">Ship type: {{shipType}}</th>
        </tr>

        <tr> <!-- name and UPP row -->
          <td colspan="2">
            <div class="celllabel">Ship Name: </div><p> {{shipName}} </p>
          </td>
          <td colspan="2">
            <div class="celllabel">Hull Size:</div>
            
            <p :class="(hullTooLarge || hullTooSmall) ? 'error-text' : ''"> {{currentShip.getHullMass}} tons {{ shipSpecs.streamlined? 'streamlined' : ''}}</p>
            <div class="celllabel">Cost: {{ shipSpecs.stdHull ? stdHullCost + ' MCr' : currentShip.customHullCost + ' MCr' }} </div>
          </td>
          <td colspan="2">
            <div class="celllabel">Hull Class:</div>
            <p :class="(hullTooLarge || hullTooSmall) ? 'error-text' : ''"> {{ shipSpecs.stdHull ? 'Standard' : '' }} {{ hullClassText }} </p>
          </td>
        </tr>


      <tr>
        <td class="sectionLabel" colspan="6">Engineering</td>
      </tr>


        <tr>
          <td colspan="2">
            <div class="celllabel">Power Plant: </div><p :class="!selectedPlantValidTypePower ? 'error-text' : '' "> {{shipSpecs.powerPlant}} </p>
            <div class="celllabel">{{ tables.powerPlant[shipSpecs.powerPlant].mass }} tons, {{ tables.powerPlant[shipSpecs.powerPlant].cost }} MCr </div>
          </td>
          <td colspan="2">
            <div class="celllabel">Maneuver Drive: <br></div><p :class="(!selectedPlantValidTypeManeuver ||  mDriveExceedPPRating) ? 'error-text' : ''"> {{shipSpecs.maneuverDrive}} </p>
            <div class="celllabel">{{ tables.maneuverDrive[shipSpecs.maneuverDrive].mass }} tons, {{ tables.maneuverDrive[shipSpecs.maneuverDrive].cost }} MCr </div>
          </td>
          <td colspan="2">
            <div class="celllabel">Jump Drive: <br></div><p :class="(!selectedPlantValidTypeJump || jDriveExceedPPRating) ? 'error-text' : ''"> {{shipSpecs.jumpDrive}} </p>
            <div class="celllabel">{{ tables.jumpDrive[shipSpecs.jumpDrive].mass }} tons, {{ tables.jumpDrive[shipSpecs.jumpDrive].cost }} MCr </div>
          </td>

        </tr>



        <tr>
          <td colspan="2">
            <div class="celllabel">Thrust: </div><p> {{ currThrustRating }} g</p>
          </td>
          <td colspan="2">
            <div class="celllabel">Jump Rating: <br></div><p> {{ currJumpRating }} parsecs </p>
          </td>
          <td colspan="2">
            <div class="celllabel">Engineering mass: </div><p> {{ currentShip.engineeringMass }} {{ engineLimitsDisplayText }} tons </p>
            <div class="celllabel">(total mass of power plant and drives) </div>
            <p class="error-text" v-if="stdHullLimtsExceeded">Tonnage of engineering section exceeds standard hull allowance</p>

          </td>

        </tr>



        <tr>
          <td colspan="2">
            <div class="celllabel">Fuel Tankage / minimum required: </div><p :class="(notEnoughFuel) ? 'error-text' : ''"> {{ shipSpecs.fuelTankage }} / {{ minFuelTankage }} </p>
          </td>
          <td colspan="2">
            <div class="celllabel">Fuel per parsec: <br></div><p> {{ fuelPerParsec }} tons</p>
          </td>
          <td colspan="2">
            <div class="celllabel">Total Jump Range: <br></div><p :class="(jumpRange < 1) ? 'error-text' : ''"> {{ jumpRange }} parsecs</p>
          </td>

        </tr>

   
        <tr>
        <td class="sectionLabel" colspan="6">Command and Control</td>
      </tr>


        <tr>
          <td colspan="3">
            <div class="celllabel">Bridge Tons: </div><p> {{ currentShip.bridgeTons }}  </p>
          </td>
          <td colspan="3">
            <div class="celllabel">Computer Model: </div><p  :class="computerJumpMismatch ? 'error-text' : '' "> {{  tables.computers[shipSpecs.computer].name      }}</p>
            <div class="celllabel">{{tables.computers[shipSpecs.computer].tons}} tons, {{ tables.computers[shipSpecs.computer].cost }}  MCr </div>
          </td>
<!-- computerJumpMismatch  -->
        </tr>


   
        <tr>
        <td class="sectionLabel" colspan="6">Berthing</td>
      </tr>


      <tr>
          <td colspan="1">
            <div class="celllabel">Staterooms: </div><p> {{ currentShip.shipSpecs.staterooms }}  </p>
          </td>
          <td colspan="1">
            <div class="celllabel">Low Berths: </div><p> {{  currentShip.shipSpecs.lowBerths      }}</p>
          </td>

          <td colspan="2">
            <div class="celllabel">Normal Crew or Passengers: </div><p> {{  normalOccupancy      }} including {{ currentShip.shipSpecs.lowBerths }} low berths</p>
          </td>
          <td colspan="2">
            <div class="celllabel">Double Occupancy: </div><p> {{  doubleOccupancy      }} including {{ currentShip.shipSpecs.lowBerths }} low berths</p>
          </td>
        </tr>



      <tr>
        <td class="sectionLabel" colspan="6">Weapons</td>
      </tr>

      <tr>
        <td colspan="6">

          <p class="error-text" v-if="excessHardpoints"> Too many hardpoints for hull size! </p>
              <table>
                <tr>
                  <th>hardpoint #</th>
                  <th>Fire Control</th>
                  <th>Turret Type</th>
                  <th>Weapons</th>
                </tr>
                <tr v-for="(mountPoint,index) in currentShip.shipSpecs.hardpoints" :key="mountPoint.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                        {{ mountPoint.fireControl ? "yes, 1 ton" : '' }}
                  </td>
                  <td>
                        <div v-if="mountPoint.fireControl">
                        {{ tables.turrets[mountPoint.turretSize].name }} 
                      </div>
                  </td>
                  <td>
                      <div v-if="mountPoint.fireControl">
                        <div v-for="(weaponMount, index) in mountPoint.turretMounts">
                          <p  v-if="mountPoint.turretMounts[index].present"> {{ weaponMount.type }}</p>

                        </div>
                      </div>

                  </td>
                </tr>

              </table>


          </td>

      </tr>






      <tr>
        <td class="sectionLabel" colspan="6">Vehicles</td>
      </tr>

      <tr>
        <td colspan="6">

              <table>
                <tr>
                  <th>Vehicle #</th>
                  <th>Type</th>
                  <th>Mass</th>
                  <th>Cost</th>
                </tr>
                <tr v-for="(vehicleEntry,index) in currentShip.shipSpecs.vehicles" :key="vehicleEntry.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                        {{ tables.vehicles[vehicleEntry.type].name }}
                  </td>
                  <td>
                        {{ tables.vehicles[vehicleEntry.type].mass }} tons
                  </td>
                  <td>
                    {{ tables.vehicles[vehicleEntry.type].cost }} MCr

                  </td>
                </tr>

              </table>

              
          </td>

      </tr>








      <tr>
        <td class="sectionLabel" colspan="6">SmallCraft</td>
      </tr>




      <tr>
        <td colspan="6">

              <table>
                <tr>
                  <th>Craft #</th>
                  <th>Type</th>
                  <th>Mass</th>
                  <th>Cost</th>
                </tr>
                <tr v-for="(craftEntry,index) in currentShip.shipSpecs.smallCraft" :key="craftEntry.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                        {{ tables.smallCraft[craftEntry.type].name }}
                  </td>
                  <td>
                        {{ tables.smallCraft[craftEntry.type].mass }} tons
                  </td>
                  <td>
                    {{ tables.smallCraft[craftEntry.type].cost }} MCr

                  </td>
                </tr>

              </table>

              
          </td>

      </tr>














      <tr>
        <td class="sectionLabel" colspan="6">Totals and Summary</td>
      </tr>


        <tr>
          <td colspan="1"> 
            <div class="celllabel">Tonnage Used: </div><p> {{ currentShip.tonnageSum }}  </p>
            <p v-if="excessTonnage" class="error-text">Tonnage of components exceeds hull tonnage</p>
          </td>
          <td colspan="1">
            <div class="celllabel">Cargo Tonnage: <br></div><p> {{cargoTonnage}} </p>
          </td>
          <td colspan="4">
            <div class="celllabel">Deckplan Volume (approx): <br></div><p> {{shipSpecs.hullMass * 14}} cubic meters </p>
            <p> {{shipSpecs.hullMass * 2}} std deckplan squares </p>
            <div class="celllabel">Deckplan squares are usually 1.5m x 1.5m, 3 meters high <br></div>
          </td>

        </tr>




        <tr>  <!-- header row -->
          <td colspan="6">
            <div class="celllabel">Description</div>
            <p> {{shipDescription}}</p> 



            
          </td>
        </tr>

<!-- old stuff   
        <tr> 
          <td colspan="2">
            <div class="celllabel">Noble Title: </div><p>  {{pcData.nobleTitle}}</p>
          </td>
          <td colspan="2"><div class="celllabel">Age:</div><p> {{pcData.age}}</p></td>
          <td colspan="2"><div class="celllabel">TAS Member:</div><p> {{pcData.tasMember? 'Yes':'False'}}</p></td>
        </tr>
  
        <tr>
          <td colspan="6"><div class="celllabel">Homeworld:</div><p> {{pcData.homeWorld}}</p></td>
        </tr>
  
  
        <tr>
          <td class="sectionLabel" colspan="6">Military Record</td>
        </tr>
  
        <tr>
          <td colspan="4"><div class="celllabel">Service:</div><p> {{pcData.career.currentServiceName}}</p></td>
          <td colspan="1"><div class="celllabel">Terms:</div><p> {{ pcData.career.terms }}</p></td>
          <td colspan="1"><div class="celllabel">Drafted:</div><p> {{pcData.flags.draftee?'Yes':'No'}}</p></td>
        </tr>
  
        <tr>
          <td colspan="2"><div class="celllabel">Rank:</div><p> {{pcData.militaryRank.rankName}}</p></td>
          <td colspan="2"><div class="celllabel">Retired:</div><p> {{pcData.flags.retired?'Yes':'No'}}</p></td>
          <td colspan="2"><div class="celllabel">Pension:</div><p> Cr. {{ pcData.career.pension }}/mo</p></td>
        </tr>
  
        <tr>
          <td colspan="6">
            <div class="celllabel">Service History:</div>
            <p v-for="(step,index) in pcData.career.termHistory" :key="'term-history'+index">{{step}}</p>
          </td>
        </tr>
  
  
        <tr>
          <td class="sectionLabel" colspan="6">Training</td>
        </tr>
  
        <tr>
          <td colspan="6">
            <div class="celllabel">Learned Skills:</div>
            <div v-for="(individualSkill, key) in pcData.skills" :key="key + '-skillsList'">
              {{ individualSkill.name }} - {{ individualSkill.level }}
            </div>
  
          </td>
        </tr>
  
        <tr>
          <td class="sectionLabel" colspan="6">Posessions and Benefits</td>
        </tr>
  
        <tr>
          <td colspan="6">
            <p> Rifle</p>
            <p> High Passage</p>
            <p> v-for through pcData.benefits</p>
  
          </td>
        </tr>
  
  
  
        <tr>
          <td colspan="3"><div class="celllabel">Wealth:</div><p> Cr {{pcData.wealth}} </p></td>
          <td colspan="3"><div class="celllabel">Retired:</div><p> {{pcData.flags.retired?'Yes':'No'}}</p></td>
        </tr>
  
 -->        
  
      </table>
  
    
      
    </div>    <!--    close out charsheet DIV -->
  
  
  
  
    <!---
    =======================================================================
    
              Footer
              
    =======================================================================  
    -->
  
  
    <div class="lrctshipbuild-footer">



      <h1>Todo list: </h1>
            <ul> 


              <li>berthing</li>

              <li>crew</li>
               <ul>
                 <li>Checkbox for crew positions to track total requirements </li>
                 <li>Limited error checking as some positions like steward are useful for planning but not required</li>
                 <li>positions</li>
                  <ul>  
                    <li>pilot</li>
                    <li>engineer 200 per 35</li>
                    <li>navigator 200</li>
                    <li>pilot</li>
                    <li>steward (per 8 high passengers)</li>
                    <li>medic - 200 (per 120)</li>
                    <li>CO / XO , 3 admins - 1000 tons or more. </li>
                    <li>Large starships rule of thumb : 10 crew per 1000 tons</li>
                    <li>desired number of passengers (will affect some positions)</li>
                  </ul>

                 <li>POP UP NOTE - One person may fill two crew positions, 
                  providing he or she has the skills needed for both jobs. 
                  However, because of the added burden, each position is 
                  filled with skill minus one, and the individual draws 
                  salary equal to 75% of each position; thus, to fill two 
                  positions, the character must have skill level 2 in each, 
                  except steward, which requires level 1. No person may 
                  assume the duties of more than two crew positions 
                  except in the case of an emergency.</li>
                </ul>





              <li>Weapons
                <ul>
                  <li>Extra ammo tonnage?</li>
                </ul>
              </li>

              <li>Computers - Eventually - storage, software options</li>
              <ul>
                <li> - storage, software options</li>
                <li>TL of build based on computers?</li>
              </ul>





              <li><em>COSTS</em></li>
                <ul>
                  <li>Architects / Plan costs</li>
                  <li>Construction Time</li>
                  <li>Downpayment</li>
                  <li>costs - factor in std designs</li>
                  <li>Factor Standard hulls for prices, outside of std designs</li>
                </ul>


               <li> construction times (factor in std designs)</li>

            </ul>
    
  <!--  
      <p>---SHIP DATA---</p>
      <p>{{ currentShip }}</p>
      -->

      
    </div>
  
  </template>
  
  
  
  
  <script setup>
  
  /*---------------------------------------------------------------------------------------------------------
          Inits
  ------------------------------------------------------------------------------------------------------------*/
  
  // import relevant vue libraries
  import { reactive, provide, ref , computed, onMounted, watch} from 'vue';
  import { storeToRefs } from 'pinia';
  
                                                    /// EXCISE / REMOVE????
                                                    let hullMassField = ref(0)  //NEVER READ

  const stdHullPicker = ref(100)
  const hullTypePicker = ref('std')


  /*---------------------------------------------------------------------------------------------------------
          Import Stores
  ------------------------------------------------------------------------------------------------------------*/
    
  // import ship info datastore - pinia 
  import { currentShipStore } from './stores/ship.js'
  const currentShip = currentShipStore()
  const {shipSpecs,shipType, shipName, shipDescription, minFuelTankage,shipBridge, hullClassList } = storeToRefs(currentShip)
  // can call shipSpecs or currentShip.shipSpecs
  // shipHullClass is called as currentShip.shipHullClass()


/*-----------------------------------------------
  Import lookup tables
/*-----------------------------------------------*/


  import { ShipRules } from './assets/ShipTables';
  // const tables = reactive(ShipRules)
  const tables = ShipRules



/*-----------------------------------------------
  Import other functions
/*-----------------------------------------------*/

  import {NumToWords} from './assets/NumToWords'
  
  

  /*---------------------------------------------------------------------------------------------------------
          Other Functions
  ------------------------------------------------------------------------------------------------------------*/
  


  /*-------------------------------------------------------
          addHardpoint
  ----------------------------------------------------------*/
  
  function addHardpoint() {
    // geneerate timcode using Date.now()
    const uniqueID = Date.now()
    const fireControlVal = false
    const turretSizeVal = 'none'
    const turrentMountsVal = [
                { position: 1 , type: 'empty', present: false }, //type zero corresponds to empty on lookuptable
                { position: 2 , type: 'empty', present: false }, //type zero corresponds to empty on lookuptable               
                { position: 3 , type: 'empty', present: false } //type zero corresponds to empty on lookuptable               
            ]

    const newhardpoint = { 
      id: uniqueID,
      fireControl: fireControlVal,
      turretSize: turretSizeVal,
      turretMounts: turrentMountsVal,
     }

    currentShip.shipSpecs.hardpoints.push(newhardpoint)

  }






  /*-------------------------------------------------------
          addVehicle
  ----------------------------------------------------------*/
  
  function addVehicle() {
    // geneerate timcode using Date.now()

    //    { id:'scout-s-v01', type: 'airraft'},

    const uniqueID = Date.now()
    const vehicleType = 'none'

    const newVehicle = { 
      id: uniqueID,
      type: vehicleType,
      
     }

    currentShip.shipSpecs.vehicles.push(newVehicle)

  }




  /*-------------------------------------------------------
          addCraft
  ----------------------------------------------------------*/
  
  function addCraft() {
    // geneerate timcode using Date.now()

    //    { id:'scout-s-v01', type: 'airraft'},

    const uniqueID = Date.now()
    const vehicleType = 'none'

    const newVehicle = { 
      id: uniqueID,
      type: vehicleType,
      
     }

    currentShip.shipSpecs.smallCraft.push(newVehicle)

  }







  /*-------------------------------------------------------
          updateTurrCount
  ----------------------------------------------------------*/
  

  function updateTurrCount(currentHardpoint) {
    // geneerate timcode using Date.now()
    console.log('updateTurrCount: turret size: '+currentHardpoint.turretSize )
    console.log(currentHardpoint)

    const numberMounts = tables.turrets[currentHardpoint.turretSize].mounts
    const maxTurretSlots = currentHardpoint.turretMounts.length
    
    console.log('updateTurrCount - mounts:' + numberMounts + ', maxSlots: ' + maxTurretSlots)

    
    
    for (let index = 0; index < maxTurretSlots ; index++) {
      // const element = array[index];
      console.log('updateTurrCount: loop: index : '+ index )
      if (index < numberMounts) {
        currentHardpoint.turretMounts[index].present = true
      } else {
        currentHardpoint.turretMounts[index].present = false
      }

      
    }

  }















  /*---------------------------------------------------------------------------------------------------------
          Watchers


// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})


------------------------------


//reactive - cannot do this

const obj = reactive({ count: 0 })

// this won't work because we are passing a number to watch()
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})



//reactive - // instead, use a getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
  ------------------------------------------------------------------------------------------------------------*/
  

  /*---------------------------------------------------
          Watch stdHullPicker - act if change std hull size
  ---------------------------------------------------*/
// single ref
watch(stdHullPicker, (newStdHull) => {
  console.log('chosen new std hull : ' + newStdHull )
  console.log( newStdHull )

  currentShip.shipSpecs.hullMass = Number(newStdHull)
  currentShip.shipSpecs.stdHull = true
})

//hullTypePicker


  /*---------------------------------------------------
          Watch hullTypePicker to 
          shift dropdown if std re-chosen
  ---------------------------------------------------*/
// single ref
watch(hullTypePicker, (chooseStd) => {
  console.log(`switch to hull mode : ${chooseStd}`)





  if (chooseStd == 'std') {
    
    console.log('---------------------------------')
    console.log('-----switched to standard')

    // bump actual hull mass to hullClass if needed
    currentShip.shipSpecs.hullMass = currentShip.shipHullClass
    console.log('bump mass to next Std Hull size: currentShip.shipSpecs.hullMass = currentShip.shipHullClass')
    console.log(currentShip.shipSpecs.hullMass)

    if (tables.hullTables[currentShip.shipHullClass].stdOption) {
      console.log('has a standard hull option too - just set the picker value')
      // it's a hull class AND has a standard option
      //no change is needed in actual mass
      stdHullPicker.value = currentShip.shipHullClass

    }  else {
      console.log('current mass has no std option - too large! over 1000! (otherwsie would class 100 or be valid)')
      stdHullPicker.value = 1000

      currentShip.shipSpecs.hullMass = 1000
    }








    // LAST STEP -  set std hull flag
    currentShip.shipSpecs.stdHull = true
  }





  //--END OF SWITCH TO STD-

  //---------------------------------------------------------

  if (chooseStd == 'custom') {
    currentShip.shipSpecs.stdHull = false
  }
})
























  /*---------------------------------------------------------------------------------------------------------
          Computed
  ------------------------------------------------------------------------------------------------------------*/

  
 /*------------------------------------------------------------------------------

 stdHullLimtsText - error messag ewhen drive size exceeded


 /*------------------------------------------------------------------------------*/

 const stdHullLimtsText = computed(() => {
      // ({{ shipSpecs.hullMass }} ton hull allows {{ tables.hullTables[currentShip.shipSpecs.hullMass].stdDriveLimit }} tons of engineering and propulsion)
      let tempText = ''

      if (currentShip.shipSpecs.stdHull) {
        tempText = currentShip.shipSpecs.hullMass + ' ton hull allows ' + tables.hullTables[currentShip.shipSpecs.hullMass].stdDriveLimit   + ' tons of engineering and propulsion'
      }



      return tempText

    })


 /*------------------------------------------------------------------------------

 engineLimitsDisplayText - Text to display in ship charg if engine limits apply


 /*------------------------------------------------------------------------------*/

 const engineLimitsDisplayText = computed(() => {
      // ({{ shipSpecs.hullMass }} ton hull allows {{ tables.hullTables[currentShip.shipSpecs.hullMass].stdDriveLimit }} tons of engineering and propulsion)
      let tempText = ''

      if (currentShip.shipSpecs.stdHull) {
        tempText =  '/ ' + tables.hullTables[currentShip.shipSpecs.hullMass].stdDriveLimit 
      }
      return tempText

    })


 /*------------------------------------------------------------------------------

 stdHullLimtsExceeded - error messag ewhen drive size exceeded


 /*------------------------------------------------------------------------------*/

 const stdHullLimtsExceeded = computed(() => {
      // ({{ shipSpecs.hullMass }} ton hull allows {{ tables.hullTables[currentShip.shipSpecs.hullMass].stdDriveLimit }} tons of engineering and propulsion)
      let flagVar = false 

      const isStdHull = currentShip.shipSpecs.stdHull

      if (isStdHull) {
        if ( currentShip.engineeringMass  > tables.hullTables[currentShip.shipHullClass].stdDriveLimit) {
          flagVar = true 
        }
      }




      return flagVar

    })



 /*------------------------------------------------------------------------------

 stdHullCost - see hull table


 /*------------------------------------------------------------------------------*/


 const stdHullCost = computed(() => {
    console.log('> ship.js stdHullCost - ')
    let hullCost = 0


    if (currentShip.shipSpecs.hullMass = currentShip.shipHullClass) {
      console.log('currentShip.shipSpecs.hullMass = currentShip.shipHullClass')

      if (tables.hullTables[currentShip.shipHullClass].stdOption) {
        //no change is needed in actual mass
        hullCost = tables.hullTables[currentShip.shipHullClass].stdCost
      }


    } 



    console.log('--- ship.js stdHullCost: '+ hullCost)
    return hullCost
  
 })







  /*---------------------------------------------------
          mDriveExceedPPRating 

          DRIVE ENGINEERING
          
          check if the drives exceed the power plant 
          rating
  ---------------------------------------------------*/
  const mDriveExceedPPRating = computed(() => {
      console.log('> app.vue mDriveExceedPPRating')
      const ppRating = tables.powerPlant[currentShip.shipSpecs.powerPlant ].index
      const jdRating = tables.powerPlant[currentShip.shipSpecs.maneuverDrive ].index

      let sufficientPower = false

      if(ppRating < jdRating) {sufficientPower = true }

      console.log(' app.vue mDriveExceedPPRating <<< : ' + sufficientPower)
      return sufficientPower
    
  })
  

  /*---------------------------------------------------
          jDriveExceedPPRating 

          DRIVE ENGINEERING
          
          check if the drives exceed the power plant 
          rating
  ---------------------------------------------------*/
  const jDriveExceedPPRating = computed(() => {
    console.log('> app.vue jDriveExceedPPRating')

      const ppRating = tables.powerPlant[currentShip.shipSpecs.powerPlant ].index
      const jdRating = tables.powerPlant[currentShip.shipSpecs.jumpDrive ].index

      let sufficientPower = false

      if(ppRating < jdRating) {sufficientPower = true }


      console.log(' app.vue jDriveExceedPPRating <<< : ' + sufficientPower)

      return sufficientPower
    
  })
  










  /*---------------------------------------------------
          currJumpRating 

          DRIVE ENGINEERING
          
          Look up the jump rating 
  ---------------------------------------------------*/
  const currJumpRating = computed(() => {
    console.log('> app.vue currJumpRating')
    console.log('PERFORMANCE!!: currJumpRating:')
    console.log('PERFORMANCE!!: currJumpRating:  ' +  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.jumpDrive] )

      const rating =  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.jumpDrive]

      console.log(' app.vue currJumpRating <<< : ' + rating)
      return rating

  })



  /*---------------------------------------------------
          currThrustRating 

          DRIVE ENGINEERING
          
          determine if the current tankage is less than
          minimum requirements 
  ---------------------------------------------------*/
  const currThrustRating = computed(() => {
    console.log('> app.vue currThrustRating')
    console.log('PERFORMANCE!!: currThrustRating:')

    console.log('PERFORMANCE!!: currThrustRating:  ' +  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.maneuverDrive] )

      const rating =  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.maneuverDrive]
      
      console.log(' app.vue currThrustRating <<< :' + rating)

      return rating
    
  })


  /*---------------------------------------------------
          notEnoughFuel 

          DRIVE ENGINEERING
          
          determine if the current tankage is less than
          minimum requirements 
  ---------------------------------------------------*/
  const notEnoughFuel = computed(() => {
    console.log('> app.vue notEnoughFuel')

    // {{ shipSpecs.fuelTankage }} / {{ currentS minFuelTankage }} 
      if ( currentShip.shipSpecs.fuelTankage < currentShip.minFuelTankage ) { 
        console.log(' app.vue notEnoughFuel <<< : true')

        return true
      }      

      console.log(' app.vue notEnoughFuel <<< : false')
      return false
    
  })
  

  /*---------------------------------------------------
          fuelPerParsec 

          HULL
          
          determine if the current tankage is less than
          minimum requirements 
  ---------------------------------------------------*/
  const fuelPerParsec = computed( () => {
    console.log('> app.vue fuelPerParsec')

    const jumpFuelMin = 0.1 * Number( currentShip.shipSpecs.hullMass )
    console.log(' app.vue fuelPerParsec <<< :' + jumpFuelMin)

    return jumpFuelMin
  })


  /*---------------------------------------------------
          jumpRange 

          HULL
          
          determine total jump range based on fuel 
  ---------------------------------------------------*/
  const jumpRange = computed( () => {
    console.log('> app.vue jumpRange')

    
    const currJumpTankage = currentShip.shipSpecs.fuelTankage - currentShip.powerfuelTankageMin
    const jumpFuelMin = 0.1 * Number( currentShip.shipSpecs.hullMass ) 
    const parsecRange = currJumpTankage / jumpFuelMin

    console.log(' app.vue jumpRange <<< :' + parsecRange)

    return parsecRange
  })

  
  

  /*---------------------------------------------------
          shipPowerArray 

          ENGINEERING
          
          generate list of available drives by hull class 
  ---------------------------------------------------*/
  const shipPowerArray = computed(() => {
    console.log('> app.vue shipPowerArray')

    // based on currentShip.shipHullClass
    const theClass = currentShip.shipHullClass
    console.log('PERFORMANCE!!: shipPowerArray:')

    console.log('PERFORMANCE!!: shipPowerArray:  ' +  tables.hullTables[theClass].performance )

    const performaceChart = tables.hullTables[theClass].performance

    console.log('Ship Hull Class for Drive array: ' + theClass)
    let optionsArray = []
    for (const currPlant in performaceChart) {
      const driveValues = tables.powerPlant[currPlant]
      const driveObject = {type: currPlant , values: driveValues}

        optionsArray.push( driveObject)
        // console.log( 'current Plant level for ' + theClass +  ' is ' +  currPlant )
    }
    
    console.log(' app.vue shipPowerArray <<< :')
    console.log(optionsArray)

    return optionsArray

  })


  
  

  /*---------------------------------------------------
          shipJumpArray 

          ENGINEERING
          
          generate list of available drives by hull class 
  ---------------------------------------------------*/
  const shipJumpArray = computed(() => {
    console.log('> app.vue shipJumpArray')

    // based on currentShip.shipHullClass
    const theClass = currentShip.shipHullClass
    console.log('PERFORMANCE!!: shipJumpArray:')

    console.log('PERFORMANCE!!: shipJumpArray:  ' +  tables.hullTables[theClass].performance )

    const performaceChart = tables.hullTables[theClass].performance

    console.log('Ship Hull Class for JUMP array: ' + theClass)
    let optionsArray = []
    for (const currPlant in performaceChart) {
      const driveValues = tables.jumpDrive[currPlant]
      const drivePerformance = performaceChart[currPlant]
      const driveObject = {type: currPlant , values: driveValues, performance: drivePerformance}

        optionsArray.push( driveObject)
    }
    
    console.log(' app.vue shipJumpArray <<< :')
    console.log(optionsArray)

    return optionsArray

  })


  /*---------------------------------------------------
          shipManeuverArray 

          ENGINEERING
          
          generate list of available drives by hull class 
  ---------------------------------------------------*/
  const shipManeuverArray = computed(() => {
    // based on currentShip.shipHullClass
    console.log('> app.vue shipManeuverArray')

    const theClass = currentShip.shipHullClass
    console.log('PERFORMANCE!!: shipManeuverArray:')

    console.log('PERFORMANCE!!: shipManeuverArray:  ' +  tables.hullTables[theClass].performance )

    const performaceChart = tables.hullTables[theClass].performance

    console.log('Ship Hull Class for JUMP array: ' + theClass)
    let optionsArray = []
    for (const currPlant in performaceChart) {
      const driveValues = tables.maneuverDrive[currPlant]
      const drivePerformance = performaceChart[currPlant]
      const driveObject = {type: currPlant , values: driveValues, performance: drivePerformance}

        optionsArray.push( driveObject)
    }
    
    console.log(' app.vue shipManeuverArray <<< :')
    console.log(optionsArray)


    return optionsArray

  })


  /*---------------------------------------------------
          cargoTonnage 

          HULL
          
          determine if the current tankage is less than
          minimum requirements 
  ---------------------------------------------------*/
  const cargoTonnage = computed(() => {
    console.log('> app.vue cargoTonnage')

      const cargo = currentShip.shipSpecs.hullMass - currentShip.tonnageSum

      console.log(' app.vue cargoTonnage <<< :' + cargo)

      return cargo
    
  })






  /*---------------------------------------------------
          hullClassText 

          HULL
          
          determine if the current tankage is less than
          minimum requirements 
  ---------------------------------------------------*/
  const hullClassText = computed(() => {
    console.log('> app.vue hullClassText')

    // based on currentShip.shipHullClass
    let returnText = currentShip.shipHullClass + ' tons'
    if (currentShip.shipSpecs.hullMass < tables.minHullSize) {returnText = 'Too Small'}
    if (currentShip.shipSpecs.hullMass > tables.maxHullSize) {returnText = 'Too Large'}
    
    console.log(' app.vue hullClassText <<< :' + returnText)

    return returnText

  })





  /*---------------------------------------------------
          excessTonnage 

          HULL
          
          flag that we have too many tons of equipment
          for the chosen hull size 
  ---------------------------------------------------*/
  const excessTonnage = computed(() => {
    console.log('> app.vue excessTonnage')
      let excess = false

      if (currentShip.tonnageSum > currentShip.shipSpecs.hullMass) { excess = true }

      console.log(' app.vue excessTonnage <<< :' + excess)
      return excess
    
  })

 

  /*---------------------------------------------------
          hullTooSmall 

          HULL
          
          hull is less than 100 tons 
  ---------------------------------------------------*/
  const hullTooSmall = computed(() => {
    console.log('> app.vue hullTooSmall')

      let sizeCheck = false
      if (currentShip.shipSpecs.hullMass < tables.minHullSize) {
        sizeCheck =  true
      } 

      console.log(' app.vue hullTooSmall <<< :' + sizeCheck)

      return sizeCheck
    
  })

  
  /*---------------------------------------------------
          hullTooLarge 

          HULL
          
          hull is more than 5000 tons 
  ---------------------------------------------------*/
  const hullTooLarge = computed(() => {
    console.log('> app.vue hullTooLarge')

      let sizeCheck = false
      if (currentShip.shipSpecs.hullMass > tables.maxHullSize) {
        sizeCheck =  true
      } 
      
      console.log(' app.vue hullTooLarge <<< :' + sizeCheck)

      return sizeCheck
    
  })








  /*---------------------------------------------------
          selectedPlantValidTypePower 

          DRIVE ENGINEERING
          
          check if power plant is valid for ship size
          only really comes up when changing hull sizes
  ---------------------------------------------------*/
  const selectedPlantValidTypePower = computed(() => {
    console.log('> app.vue selectedPlantValidTypePower')

      const plantType = 'powerPlant'  // jumpDrive // maneuverDrive
      const currentPlant = currentShip.shipSpecs[plantType]
      const functionHullSize = currentShip.shipHullClass
      //////   FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! must be class mass!!!!


      // can use hasOwnProperty() to check for a key
      // also can check this way
      // var obj = { key: undefined };
      // console.log("key" in obj); // true, regardless of the actual value


      // If you want to check if a key doesn't exist, remember to use parenthesis:

      // var obj = { not_key: undefined };
      // console.log(!("key" in obj)); // true if "key" doesn't exist in object
      // console.log(!"key" in obj);   // Do not do this! It is equivalent to "false in obj"
      console.log('> selectedPlantValidTypePower: functionHullSize: ' + functionHullSize)
      console.log('PERFORMANCE!!   FIXED: selectedPlantValidTypePower:')
      console.log('PERFORMACE!!!!  >>>>>>>>>>>>>> ')
      console.log('PERFORMANCE!!: selectedPlantValidTypePower:  ' +  tables.hullTables[functionHullSize].performance )
      const plantExists = ( currentPlant   in  tables.hullTables[functionHullSize].performance    )
      console.log('> selectedPlantValidTypePower: currentPlant   in  tables.hullTables[functionHullSize].performance: ' + plantExists)


      return plantExists
    
  })
  



  /*---------------------------------------------------
          selectedPlantValidTypeJump 

          DRIVE ENGINEERING
          
          check if power plant is valid for ship size
          only really comes up when changing hull sizes
  ---------------------------------------------------*/
  const selectedPlantValidTypeJump = computed(() => {
    console.log('> app.vue selectedPlantValidTypePower')

      const plantType = 'jumpDrive'  // jumpDrive // maneuverDrive  //powerPlant
      const currentPlant = currentShip.shipSpecs[plantType]
      const functionHullSize = currentShip.shipHullClass
      console.log('> selectedPlantValidTypePower: functionHullSize: ' + functionHullSize)

      console.log('PERFORMANCE!!: selectedPlantValidTypeJump:')

      console.log('PERFORMANCE!!: selectedPlantValidTypeJump:  ' +  tables.hullTables[functionHullSize].performance )

      const plantExists = ( currentPlant   in  tables.hullTables[functionHullSize].performance    )
      console.log('> selectedPlantValidTypeJump: currentPlant   in  tables.hullTables[functionHullSize].performance: ' + plantExists)


      return plantExists
    
  })
  


  /*---------------------------------------------------
          selectedPlantValidTypeManeuver 

          DRIVE ENGINEERING
          
          check if power plant is valid for ship size
          only really comes up when changing hull sizes
  ---------------------------------------------------*/
  const selectedPlantValidTypeManeuver = computed(() => {
    console.log('> app.vue selectedPlantValidTypeManeuver')

      const plantType = 'maneuverDrive'  // jumpDrive // maneuverDrive  //powerPlant
      const currentPlant = currentShip.shipSpecs[plantType]
      const functionHullSize = currentShip.shipHullClass
      console.log('> selectedPlantValidTypePower: functionHullSize: ' + functionHullSize)
      console.log('PERFORMANCE!!: selectedPlantValidTypeManeuver:')

      console.log('PERFORMANCE!!: selectedPlantValidTypeManeuver:  ' +  tables.hullTables[functionHullSize].performance )

      const plantExists = ( currentPlant   in  tables.hullTables[functionHullSize].performance    )
      console.log('> selectedPlantValidTypeManeuver: currentPlant   in  tables.hullTables[functionHullSize].performance: ' + plantExists)


      return plantExists
    
  })
  





  /*---------------------------------------------------
          computerJumpMismatch 

          CONTROL ENGINEERING
          
          Does the computer support the jump drive rating 
          returns TRUE if insufficient computer capacity
  ---------------------------------------------------*/
  const computerJumpMismatch = computed(() => {
    console.log('> app.vue computerJumpMismatch')
    console.log('PERFORMANCE!!: computerJumpMismatch:')

    console.log('PERFORMANCE!!: computerJumpMismatch:  ' +  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.jumpDrive] )


    const jumpRating =  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.jumpDrive]
    const computerRating = tables.computers[currentShip.shipSpecs.computer].jumpRating 

    console.log( 'Jump: ' + jumpRating + ', computer rating: ' + computerRating)

    const inadequateComputer = ( jumpRating > computerRating   ) 
      
      
      console.log(' app.vue computerJumpMismatch <<< :' + inadequateComputer)

      return inadequateComputer
    
  })




  /*---------------------------------------------------
          normalOccupancy 

          LIFE
          
          total of staterooms and low berths, assuming 1 per
          for normal commercial usage for crew and passengers
  ---------------------------------------------------*/
  const normalOccupancy = computed(() => {
    console.log('> app.vue normalOccupancy')

    const stateRooms = currentShip.shipSpecs.staterooms * tables.berthing.stateroom.passengers
    //low berths cannot do double occupancy so only single
    const lowBerths = currentShip.shipSpecs.lowBerths

    const numberOfPeople = stateRooms + lowBerths


      console.log(' app.vue normalOccupancy <<< :' + numberOfPeople)

      return numberOfPeople
    
  })





  /*---------------------------------------------------
          doubleOccupancy 

          CONTROL ENGINEERING
          
          total of staterooms and low berths, assuming 2 per
          stateroom as allowed for non-commercial ships
  ---------------------------------------------------*/
  const doubleOccupancy = computed(() => {
    console.log('> app.vue doubleOccupancy')

    const stateRooms = currentShip.shipSpecs.staterooms * tables.berthing.stateroom.double
    //low berths cannot do double occupancy so only single
    const lowBerths = currentShip.shipSpecs.lowBerths

    const numberOfPeople = stateRooms + lowBerths


      console.log(' app.vue doubleOccupancy <<< :' + numberOfPeople)

      return numberOfPeople
        
  })

  


  /*---------------------------------------------------
          haveMaxHardpoints 

          relies on currentShip.hardpointLimit

          WEAPONS
          
  ---------------------------------------------------*/
  const haveMaxHardpoints = computed(() => {
    console.log('> app.vue haveMaxHardpoints')

    const numberofHardpoints = currentShip.shipSpecs.hardpoints.length

    const haveMax = (numberofHardpoints == currentShip.hardpointLimit)

      console.log(' app.vue haveMaxHardpoints <<< :' + haveMax)

      return haveMax
        
  })





  /*---------------------------------------------------
          excessHardpoints 

          relies on currentShip.hardpointLimit

          WEAPONS
          
  ---------------------------------------------------*/
  const excessHardpoints = computed(() => {
    console.log('> app.vue excessHardpoints')

    const numberofHardpoints = currentShip.shipSpecs.hardpoints.length

    const overMax = (numberofHardpoints > currentShip.hardpointLimit)

      console.log(' app.vue excessHardpoints <<< :' + overMax)

      return overMax
        
  })

















  /*---------------------------------------------------
          currJumpRating 

          DRIVE ENGINEERING
          
          Look up the jump rating 


  const currJumpRating = computed(() => {
    console.log('> app.vue currJumpRating')

      const rating =  tables.hullTables[currentShip.shipHullClass].performance[currentShip.shipSpecs.jumpDrive]

      console.log(' app.vue currJumpRating <<< : ' + rating)
      return rating

  })
  ---------------------------------------------------*/






  /*---------------------------------------------------------------------------------------------------------
          On Mounted
  ------------------------------------------------------------------------------------------------------------*/
  
  onMounted( () => { 
  
    console.log('App: onMounted');
    // we will want to initialize a scout ship by loading it from default
    // later we'll want to have a dropdown to load other ship types into the current display


  
  } )
  
  
  
  /*---------------------------------------------------------------
  
  Data extraction
  
  ------------------------------------------------------------------*/
  
  
  
  
  /*---------------------------------------------------------------
  
  Data collection /formatting
  
  ------------------------------------------------------------------*/
  
  
  // const strPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.strength.value)
  // })
  
  // const dexPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.dexterity.value)
  // })
  
  // const endPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.endurance.value)
  // })
  
  // const intPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.intelligence.value)
  // })
  
  // const eduPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.education.value)
  // })
  
  // const socPHex = computed( () => {
  //     return getPHex(charData.pcData.characteristics.social.value)
  // })
  
  
  
  // const generateUPP = computed( () => {
  // // //    let upp = this.pcData.characteristics.strength.pHexValue + this.pcData.characteristics.dexterity.pHexValue + this.pcData.characteristics.endurance.pHexValue + this.pcData.characteristics.intelligence.pHexValue + this.pcData.characteristics.education.pHexValue + this.pcData.characteristics.social.pHexValue;
  //     // const strV = charData.pcData.characteristics.strength.pHexValue
  //     // const dexV = charData.pcData.characteristics.dexterity.pHexValue
  //     // const endV = charData.pcData.characteristics.endurance.pHexValue
  //     // const intV = charData.pcData.characteristics.intelligence.pHexValue
  //     // const eduV = charData.pcData.characteristics.education.pHexValue
  //     // const socV = charData.pcData.characteristics.social.pHexValue
  
  //     const uppVal = strPHex.value+dexPHex.value+endPHex.value+intPHex.value+eduPHex.value+socPHex.value
  //     return uppVal;
  // })
  
  //  WATCH format for property of reactive opbject
  // watch(
  //   () => obj.count,
  //   (count) => {
  //     console.log(`count is: ${count}`)
  //   }
  // )
  
  
  /*-------------------------------------------------------------------
  
    Old Stuff
  
  /*-------------------------------------------------------------------

  watch(
    () => creationStatus.currentStep,
    (currentStep) => {
  
  //    }
     if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.setHomeworld  ) {
      creationStatus.currentScreen = SetHomeworld
      console.log( 'SWITCHING WATCHER: setting Homeworld')
  
     }
     if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.chooseCareer  ) {
      creationStatus.currentScreen = chooseCareer
      console.log( 'SWITCHING WATCHER: to choose career')
  
     }
     if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.doTerm  ) {
      creationStatus.currentScreen = doTerm
      console.log( 'SWITCHING WATCHER: starting a term')
  
     }
     if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.chooseSkills  ) {
      creationStatus.currentScreen = chooseSkills
      console.log( 'SWITCHING WATCHER: chooseing skills')
  
     }
    //endOfTerm
    if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.endOfTerm  ) {
      creationStatus.currentScreen = endOfTerm
      console.log( 'SWITCHING WATCHER: End of Term')
  
     }
    if ( creationStatus.currentStep ===  creationStatus.stepNamesMap.musterOut  ) {
      creationStatus.currentScreen = musterOut
      console.log( 'SWITCHING WATCHER: Mustering Out')
  
     }
   
    }
  )
  
    /*-------------------------------------------------------------------  */



    

  /*-------------------------------------------------------------------


  
  /*-------------------------------------------------------------------*/  
  
  
  
  
  
  
  </script>
  
  
  
  
  
  
  
  
  
  
  <style>
  
  #lr-travtools-ct-shipbuild {
    background-color: #e6ebf0;
    font-family: Arial, Helvetica, sans-serif;
    color: #111111;
  }
  
  
  .error-text { 
    color: #be2218;
  }
  
  
  #lr-travtools-ct-shipbuild .lrctshipbuild-left {
  width: 48%;
  float:left;
  padding: 0.5em;
  }
  
  
  #lr-travtools-ct-shipbuild .lrctshipbuild-shipsheet {
    width: 47%;
    float:right;
    padding: 0.6em 0.6em 0.6em 1.5em;
    border-left: 1px solid black;
  
  }
  
  #lr-travtools-ct-shipbuild .lrctshipbuild-footer {
    clear:both;
    width:100%;
    padding: 5px;
    border-top: 1px solid black;
  }
  
  
  #lr-travtools-ct-shipbuild h1,h2,h3 {
    color: #be2218;
  }
  
  #lr-travtools-ct-shipbuild a:link, a:visited {
    color: #be2218;
  }
  
  #lr-travtools-ct-shipbuild a:hover {
    color: #555555;
  }
  
  #lr-travtools-ct-shipbuild table, th, td ,tr {
    border: 1px solid;
    border-collapse: collapse;
    text-align:left;
    padding: .3em;
  }
  
  #lr-travtools-ct-shipbuild table.lrctshipbuild-shiptable {
    width: 95%;
  }
  
  #lr-travtools-ct-shipbuild th {
    color: #cfcfcf;
    border-color: white;
    background-color: #222;
    font-weight: bold;
  }
  
  #lr-travtools-ct-shipbuild td.sectionLabel {
    color: #cfcfcf;
    border-color: white;
    background-color: #222;
    font-weight: bold;
  }
  
  
  #lr-travtools-ct-shipbuild table div.celllabel {
    color: #111111;
    font-size: 0.8em;
  }
  
  
  
  
  </style>
  
  <!-- 
  <style scoped>
  header {
    line-height: 1.5;
    max-height: 100vh;
  }
  
  .logo {
    display: block;
    margin: 0 auto 2rem;
  }
  
  nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }
  
  nav a.router-link-exact-active {
    color: var(--color-text);
  }
  
  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }
  
  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }
  
  nav a:first-of-type {
    border: 0;
  }
  
  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }
  
    .logo {
      margin: 0 2rem 0 0;
    }
  
    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  
    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;
  
      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
  </style>
  
  
  -->






















<!--   









<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>




-->