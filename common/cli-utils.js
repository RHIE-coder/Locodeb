const { spawn } = require('child_process');

class Font {
  static isLinuxPlatform() {
    return process.platform === 'linux';
  }

  static STYLE = {
    DEFAULT:0,
    BOLD:1,
    LIGHT:2,
    ITALIC:3,
    UNDERLINE:4,
    REVERSE:7,
  }

  static COLOR = {
    BLACK: 30,
    RED: 31,
    GREEN: 32,
    ORANGE: 33,
    BLUE: 34,
    PURPLE: 35,
    CYAN: 36,
    GREY: 37,
    DARK_GREY: 90,
    LIGHT_RED: 91,
    LIGHT_GREEN: 92,
    YELLOW: 93,
    LIGHT_BLUE: 94,
    LIGHT_PURPLE:95,
    TURQUOISE: 96,
    WHITE: 97,
  }

  static BACKGROUND_COLOR = {
    BLACK: 40,
    RED: 41,
    GREEN: 42,
    ORANGE: 43,
    BLUE: 44,
    PURPLE: 45,
    CYAN: 46,
    WHITE: 47,
  }

  static parse(message, options) {
    if(!Font.isLinuxPlatform) {
      return message;
    }
    const style = options.style ?? Font.STYLE.DEFAULT;
    const color = options.color ?? Font.COLOR.WHITE;
    const background_color = options.background_color ?? Font.BACKGROUND_COLOR.BLACK;
    const fontMsg = `\x1b[${style ? style+";":""}${background_color};${color}m${message}\x1b[0m`
    return fontMsg
  }

}

function $cli(stringArg, options) {

  return new Promise((resolve, reject)=>{
    const command = stringArg[0].split(" ");
    const action = command[0];
    const cmdArgs = [];
    
    if(options.cwd) {
      cmdArgs.push(...command.slice(1, command.length-1))
    } else {
      cmdArgs.push(...command.slice(1))
    }

    const origin_cmd_msg = ` ${action+" "+cmdArgs.join(" ")}`
    const instMsg  = Font.parse("RUN CLI", {
      style: Font.STYLE.REVERSE,
      color: Font.COLOR.YELLOW,
      background_color: Font.BACKGROUND_COLOR.GREEN, 
    })
    const delimit = Font.parse(" : ", {
      style: Font.STYLE.BOLD,
      color: Font.COLOR.YELLOW,
      background_color: Font.BACKGROUND_COLOR.GREEN, 
    })
    console.log(instMsg + delimit + origin_cmd_msg)

    const baseSpawnOption = {
      stdio: 'inherit',
    }

    if(options.cwd) {
      baseSpawnOption.cwd = options.cwd;
    }

    baseSpawnOption.env = {
      ...process.env,
    }

    if(options.env) {
      baseSpawnOption.env = {
        ...baseSpawnOption.env,
        ...options.env
      }
    }

    const executed = spawn(action, cmdArgs, baseSpawnOption);
    executed.on('exit', (code,signal)=>{
      console.log(`EXIT: code=${code}, signal=${signal}`)
      if(code == 0) {
        resolve(code);
      } else {
        reject(code)
      }
    })
  })

}

module.exports = {
    Font,
    $cli,
}