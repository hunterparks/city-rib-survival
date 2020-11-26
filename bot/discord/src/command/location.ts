import { JsonDB } from 'node-json-db';
import { Config } from '../config/config';
import { Command } from '../model/command';
import { DatabaseService } from '../service/database-service';
import { LocationModel, Dimension } from '../model/location-model';
import { Coordinate } from '../model/coordinate';

const COMMAND = {
    ADD: 'add',
    DELETE: 'delete',
    HELP: 'help',
    LIST: 'list',
    SEARCH: 'search',
    UPDATE: 'update'
};
const DATABASE_NAME = 'minecraft-locations';
const NUM_ARGS: {[index: string]: number} = {
    add: 6,
    delete: 2,
    help: 1,
    list: 2,
    search: 2,
    update: 7
};

export class Location extends Command {
    public name = 'location';
    public description = 'Command to manage minecraft location data!';
    public authorizedChannels = [ Config.CHANNEL.Locations ];
    public authorizedUsers = [];
    private _db: JsonDB;
    public execute(message: any, args: string[]): void {
        const command = args[0].toLowerCase();
        if (NUM_ARGS[command] !== args.length) return; // TODO: Handle this
        const getAddArguments = () => {
            return {
                name: args[1],
                x: parseInt(args[2]),
                y: parseInt(args[3]),
                z: parseInt(args[4]),
                dimension: LocationModel.getDimension(args[5].toLowerCase())
            };
        };
        const getDeleteArguments = () => {
            return {
                id: args[1]
            };
        };
        const getListArguments = () => {
            return {
                dimension: LocationModel.getDimension(args[1].toLowerCase())
            };
        };
        const getSearchArguments = () => {
            return {
                name: args[1]
            };
        };
        const getUpdateArguments = () => {
            return {
                id: args[1],
                name: args[2],
                x: parseInt(args[3]),
                y: parseInt(args[4]),
                z: parseInt(args[5]),
                dimension: LocationModel.getDimension(args[6].toLowerCase())
            };
        };
        switch(command) {
            case COMMAND.ADD: {
                const { name, x, y, z, dimension } = getAddArguments();
                const newLocation = new LocationModel(name, new Coordinate(x, y, z), dimension);
                this._db.push(`/data/location/${newLocation.id}`, newLocation, true);
                this._db.push(`/data/dimension/${newLocation.dimension}[]`, newLocation.id);
                try {
                    const savedLocation = this._db.getData(`/data/location/${newLocation.id}`) as LocationModel;
                    if (newLocation.equals(savedLocation)) {
                        this.reactSuccess(message);
                    } else {
                        this.reactFailure(message);
                    }
                }
                catch(error) {
                    this.reactFailure(message);
                    console.log(error);
                }
                break;
            }
            case COMMAND.DELETE: {
                const { id } = getDeleteArguments();
                try {
                    const locationModel = this._db.getData(`/data/location/${id}`) as LocationModel;
                    const dimension = locationModel.dimension;
                    const dimensionArray = this._db.getData(`/data/dimension/${dimension}`) as string[];
                    const locationIndex = dimensionArray.indexOf(locationModel.id);
                    this._db.delete(`/data/dimension/${dimension}[${locationIndex}]`);
                    this._db.delete(`/data/location/${id}`);
                    this.reactSuccess(message);
                }
                catch(error) {
                    this.reactFailure(message);
                    console.log(error);
                }
                break;
            }
            case COMMAND.HELP: {
                this.printDocumentation(message);
                break;
            }
            case COMMAND.LIST: {
                const { dimension } = getListArguments();
                try {
                    const locations = this._db.getData(`/data/dimension/${dimension}`) as string[];
                    const normalizedDimension = dimension.charAt(0).toUpperCase() + dimension.slice(1);
                    let data = `\`\`\`${normalizedDimension} Locations\n`;
                    for (let location of locations) {
                        const locationModel = this._db.getData(`/data/location/${location}`) as LocationModel;
                        data += `  ${locationModel.name}: ${locationModel.coordinates.x}, ${locationModel.coordinates.y}, ${locationModel.coordinates.z} [${locationModel.id}]\n`;
                    }
                    data += '```';
                    message.channel.send(data);
                    this.reactSuccess(message);
                }
                catch(error) {
                    this.reactFailure(message);
                    console.log(error);
                }
                break;
            }
            case COMMAND.SEARCH: {
                this.reactFailure(message);
                break;
            }
            case COMMAND.UPDATE: {
                const { id, name, x, y, z, dimension } = getUpdateArguments();
                const updatedLocation = new LocationModel(name, new Coordinate(x, y, z), dimension, id);
                this._db.push(`/data/location/${id}`, updatedLocation, true);
                try {
                    const savedLocation = this._db.getData(`/data/location/${id}`) as LocationModel;
                    if (updatedLocation.equals(savedLocation)) {
                        this.reactSuccess(message);
                    } else {
                        this.reactFailure(message);
                    }
                }
                catch(error) {
                    this.reactFailure(message);
                    console.log(error);
                }
                break;
            }
        }
    }
    constructor() {
        super();
        this._db = new DatabaseService(DATABASE_NAME).getDb();
    }
    private printDocumentation(message: any): void {
        message.channel.send(`\`\`\`
!location [command] [options]
Command:
    add - Adds a new location
    delete - Deletes a location
    help - Prints this message
    list - Lists locations in a dimension
    serach - Searches for a location \\\\ NOT IMPLEMENTED
    update - Updates a location
Options:
    add ->    !location add [name] [x] [y] [z] [dimension]
    delete -> !location delete [id]
    help ->   !location help
    list ->   !location list [dimension]
    search -> !location search [name]
    update -> !location update [id] [name] [x] [y] [z] [dimension]
Arguments:
    id - Unique identifier for location
        Use list command to find id
    name - Name of the location, as follows:
        Use only alphanumeric characters
        Use dash instead of space
    x - X coordinate of the location
    y - Y coordinate of the location
    z - Z coordinate of the location
    dimension - Dimension of the location, as follows:
        e or end-> End
        n or nether -> Nether
        o or overworld -> Overworld
\`\`\``);
    }
    private reactFailure(message: any): void {
        message.react('❎');
    }
    private reactSuccess(message: any): void {
        message.react('✅');
    }
}