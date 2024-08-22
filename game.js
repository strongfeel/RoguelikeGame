import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.atk = 10;
  }

  attack() {
    // 플레이어의 공격
    return chalk.red(`몬스터에게 ${this.atk}의 피해를 입혔습니다.`);
  }
}

class Monster {
  constructor(stage) {
    this.hp = 50 + stage;
    this.atk = 10 + stage;
  }

  attack() {
    // 몬스터의 공격
    return chalk.red(`당신은 ${this.atk}의 피해를 입었습니다.`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function rand() {
  return Math.floor(Math.random() * 10);
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| Player HP : ${player.hp}, Attack: ${player.atk}`) +
      chalk.redBright(`| Monster HP : ${monster.hp}, Attack: ${monster.atk} |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let cnt = 0;

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 도망간다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    if (choice === '1') {
      cnt++;
      logs.push(`[${cnt}]` + player.attack());
      monster.hp -= player.atk;
      if (monster.hp > 0) {
        logs.push(`[${cnt}]` + monster.attack());
        player.hp -= monster.atk;
      } else {
        console.log(chalk.blue('축하합니다! 몬스터를 쓰러트렸습니다!'));
        player.hp = 100 + rand();
        player.atk = player.atk + rand();
        await sleep(3000);
        break;
      }
    } else if (choice === '2') {
      console.log(chalk.yellow('싸움에서 도망을 쳤습니다.'));
      console.log(chalk.yellow('도망을 쳤기 때문에, 체력 회복은 불가 합니다.'));
      await sleep(3000);
      break;
    } else {
      logs.push(chalk.green('정확한 번호를 입력해 주세요'));
    }

    // 스테이지 클리어 및 게임 종료 조건
    if (player.hp <= 0) {
      console.log(chalk.yellow('플레이어가 사망했습니다.'));
      console.log(chalk.yellow('게임 오버'));
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);
    stage++;
  }

  // 스테이지 클리어 및 게임 종료 조건
  if (stage > 10 && player.hp > 0) {
    console.log(chalk.yellow('모든 스테이지를 완료하였습니다.'));
  }
}
