<template>
  <v-row dense>
    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-clover</v-icon>
          このアプリについて
        </v-card-title>
        <v-card-text>
          <div>
            多くの人に福井県の力のある企業を知ってもらい、地域活性化を目指しているアプリです。
          </div>
          <div>
            このアプリでは、「力のある企業」=「何らかの分野でNo.1である企業」としております。
          </div>
          <div>
            福井県に存在するNo.1企業を知り、また自分の知っているNo.1企業を共有して、より多くの人が福井県の企業に興味を持ってもらえることを願っております。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-web</v-icon>
          推奨環境（ブラウザ）
        </v-card-title>
        <v-card-text>
          <div>Google Chrome（動作確認済みバージョン：101.0.4951.54）</div>
          <div>Edge Chromium（動作確認済みバージョン：101.0.1210.47）</div>
          <div>Firefox</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-google</v-icon>
          ログイン
        </v-card-title>
        <v-card-text>
          <div>Googleアカウントを使用してログインすることができます。</div>
          <div>
            ログインすることで、「新規投稿」「投稿のお気に入り登録」などが可能となります。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-plus</v-icon>
          新規投稿
        </v-card-title>
        <v-card-text>
          <div>画面右下の＋ボタンより新規投稿画面を開くことができます。</div>
          <div>企業検索では福井県の企業を選択できます。</div>
          <div>
            ※他の投稿で既に登録されている企業に関しては、選択できません。
          </div>
          <div>
            「No.1の内容」には「何の分野でNo.1であるか」を記載し、また複数記載することができます。（例「眼鏡生産台数」「眼鏡売上高」など）
          </div>
          <v-row>
            <v-col sm="6" col="12">
              <v-img max-height="400" contain src="/usageNewPost.png" />
            </v-col>
            <v-col sm="6" col="12">
              <v-img max-height="400" contain src="/usagePostInput.png" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-text-search</v-icon>
          投稿閲覧
        </v-card-title>
        <v-card-text>
          <div>
            「ホーム」では、このアプリに登録された投稿が表示されます。（未ログイン状態の場合でも閲覧可能です。）
          </div>
          <div>
            企業のホームページURLが登録されている場合は、企業名をクリックすると企業のホームページを開くことができます。
          </div>
          <div>
            スーパーリロード（例：Windows*Google
            Chromeの場合、ctrl+リロード）によるブラウザ画面更新を行うと未ログイン状態として投稿内容が表示されるため、スーパーリロードせずにブラウザ画面更新を行ってください。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-alert</v-icon>
          通報
        </v-card-title>
        <v-card-text>
          <div>
            他の人が作成した投稿に誤りがある場合は、通報アイコンより通報することができます。
          </div>
          <div>一度通報された投稿は全ユーザに対して表示されなくなります。</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title>
          <v-icon>mdi-check</v-icon>
          利用規約
        </v-card-title>
        <v-card-text>
          <div>
            本アプリでの投稿内容・通報内容に起因した直接的または間接的なトラブルについては、本アプリ運営者側では責任を負いません。
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { PageHeadData } from '@f/definition/pages/common/headData';

export default Vue.extend({
  name: 'AppUsage',
  data() {
    return {
      columnSpan: '12',
    };
  },
  head(): PageHeadData {
    return {
      title: '使い方',
    };
  },
});
</script>

<style lang="sass" scoped>
.pre-wrap
  white-space: pre-wrap
</style>
