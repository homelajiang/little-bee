/**
 * import package.json
 * https://stackoverflow.com/questions/34907682/how-to-display-the-app-version-in-angular/48869478#48869478
 */
import pkg from '../../package.json'

export const environment = {
  version: `${pkg.version}-dev`,
  production: false
}

