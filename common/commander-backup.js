class Command {

    constructor() {
        this.opt = null;
        this.short_opt = null;
        this.desc = "";
        this.act = null;
    }

    setOption(option_keyword, short_option) {
        if(!option_keyword) {
            throw new ReferenceError("main option must be set")
        }
        this.opt = option_keyword;
        this.short_opt = short_option
        return this;
    }

    setDesc(description) {
        this.desc = description;
        return this;
    }

    setAction(action) {
        this.act = action;
        return this;
    }

    isComplete(is_include_short_opt) {
        if(is_include_short_opt) {
            return this.opt && this.short_opt && this.act;
        }
        return this.opt && this.act;
    }

}


module.exports.Program = class {

    constructor() {
        this.command_list = [];
    }

    name(program_name) {
        this.program_name = program_name;
    }

    purpose(desc) {
        this.program_desc = desc;
    }
    
    by() {
        const cmd = new Command();
        this.command_list.push(cmd);
        return cmd;
    }

    helpMessage() {
        let msg = `
            ${this.program_name}
                ${this.program_desc} 
        `
        
        for(let i = 0; i < this.command_list.length; i++) {
            const cmd = this.command_list[i];
            msg += `
                ${cmd.opt}${cmd.short_opt ? ", " + cmd.short_opt : ""}
                
                    ${cmd.desc}
            
            `
        }

        return msg;
    }


    exec(process_args) {
        const cmd = process_args[2];
        const program_args = [];

        if(!cmd) {
            throw new ReferenceError("not valid command line")
        }

        if (process_args.length > 3) {
            program_args.push(...process_args.slice(3))
        }
    }

}